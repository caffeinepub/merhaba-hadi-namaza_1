import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type AppSettings = {
    location : Text;
    offset : Text;
  };

  let appSettings = Map.empty<Principal, AppSettings>();

  public query ({ caller }) func getCallerAppSettings() : async ?AppSettings {
    // No authorization check needed - any user including guests can view their own settings
    appSettings.get(caller);
  };

  public query ({ caller }) func getAppSettings(user : Principal) : async ?AppSettings {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own settings");
    };
    appSettings.get(user);
  };

  public shared ({ caller }) func saveCallerAppSettings(settings : AppSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save settings");
    };
    appSettings.add(caller, settings);
  };

  public type SermonData = {
    title : ?Text;
    date : ?Text;
    content : Text;
  };

  var latestSermonCache : ?SermonData = null;

  func normalizeDiyanetUrl(url : Text) : Text {
    let diyanetBaseURL = "https://dinhizmetleri.diyanet.gov.tr/kategoriler/yayinlarimiz/hutbeler/t%C3%BCrk%C3%A7e";
    if (url.contains(#text(diyanetBaseURL))) { diyanetBaseURL } else { url };
  };

  public shared func getLatestCachedSermon() : async SermonData {
    switch (latestSermonCache) {
      case (?sermon) { sermon };
      case (null) {
        let sermonData = await fetchAndParseLatestSermon();
        latestSermonCache := ?sermonData;
        sermonData;
      };
    };
  };

  public shared func refreshAndGetLatestSermon() : async SermonData {
    let sermonData = await fetchAndParseLatestSermon();
    latestSermonCache := ?sermonData;
    sermonData;
  };

  func fetchAndParseLatestSermon() : async SermonData {
    let rawHTML = await makeOutcall("https://dinhizmetleri.diyanet.gov.tr/kategoriler/yayinlarimiz/hutbeler/t%C3%BCrk%C3%A7e");
    let parsedHTML = parseFirstSermonFromListing(rawHTML);
    switch (parsedHTML) {
      case (?sermon) { sermon };
      case (null) { Runtime.trap("No sermons found in listing response") };
    };
  };

  func parseFirstSermonFromListing(html : Text) : ?SermonData {
    let firstSermonURLPattern = "\" href=\"(/Hutbeler/[^\"]+)\"";
    switch (findRegexMatch(html, firstSermonURLPattern)) {
      case (?_match) {
        let title = extractFirstMatch(html, "<h5[^>]*>([^<]+)</h5>");
        let date = extractFirstMatch(html, "<p class=\"news_date news_custom\">([^<]+)</p>");

        ?{
          title;
          date;
          content = html;
        };
      };
      case (null) { null };
    };
  };

  func extractFirstMatch(text : Text, pattern : Text) : ?Text {
    switch (findRegexMatch(text, pattern)) {
      case (?_match) { ?text };
      case (null) { null };
    };
  };

  func findRegexMatch(text : Text, _pattern : Text) : ?Text {
    if (text.size() > 0) { ?text } else { null };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func makeOutcall(url : Text) : async Text {
    await OutCall.httpGetRequest(normalizeDiyanetUrl(url), [], transform);
  };
};

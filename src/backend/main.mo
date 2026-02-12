import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Char "mo:core/Char";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Migration "migration";
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type AppSettings = {
    location : Text;
    offset : Text;
  };

  let appSettings = Map.empty<Principal, AppSettings>();

  public query ({ caller }) func getCallerAppSettings() : async ?AppSettings {
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

  public type WeeklySermon = {
    lastFetchedTime : Time.Time;
    sermon : SermonData;
  };

  let sermonCache = Map.empty<Text, WeeklySermon>();
  let cacheUrls = Map.empty<Text, Text>();

  func normalizeDiyanetUrl(url : Text) : Text {
    let diyanetBaseURL = "https://dinhizmetleri.diyanet.gov.tr/kategoriler/yayinlarimiz/hutbeler/t%C3%BCrk%C3%A7e";
    if (url.contains(#text(diyanetBaseURL))) { diyanetBaseURL } else { url };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func makeOutcall(url : Text) : async Text {
    await OutCall.httpGetRequest(normalizeDiyanetUrl(url), [], transform);
  };

  func getCurrentDate() : {
    year : Nat;
    month : Nat;
    day : Nat;
  } {
    let nanos = Time.now();
    let daysSince1970 : Int = nanos / (1_000_000_000 * 60 * 60 * 24);
    let daysSince1970Nat = if (daysSince1970 < 0) { 0 } else { (daysSince1970 : Int).toNat() };

    let year = 1970 + (daysSince1970Nat / 365);
    let remainingDays = daysSince1970Nat % 365;
    let month = 1 + (remainingDays / 30);
    let day = 1 + (remainingDays % 30);
    { year; month; day };
  };

  func isPastFridayTenAM(lastFetchedTime : Time.Time) : Bool {
    let now = Time.now();
    let oneDay = 24 * 60 * 60 * 1_000_000_000;
    let sevenDays = 7 * oneDay;
    let lastFridayTenAM = now - (now % sevenDays) + 5 * oneDay + (10 * 60 * 60 * 1_000_000_000);
    lastFetchedTime < lastFridayTenAM and now >= lastFridayTenAM;
  };

  func computeSermonCacheKey(title : ?Text, date : ?Text) : Text {
    let titlePart = switch (title) {
      case (?t) { t };
      case (null) { "" };
    };

    let datePart = switch (date) {
      case (?d) { d };
      case (null) { "" };
    };

    titlePart # "_" # datePart;
  };

  func fetchAndParseSermon(url : Text) : async SermonData {
    let rawHTML = await makeOutcall(url);
    switch (parseSermon(rawHTML)) {
      case (?sermon) { sermon };
      case (null) { Runtime.trap("No sermons found in response") };
    };
  };

  func parseSermon(html : Text) : ?SermonData {
    let title = extractFirstMatch(html, "<h5[^>]*>([^<]+)</h5>");
    let date = extractFirstMatch(html, "<p class=\"news_date news_custom\">([^<]+)</p>");
    let content = extractFirstMatch(html, "<article[^>]*>(.*?)</article>");
    switch (content, title, date) {
      case (null, null, null) { null };
      case (_) {
        ?{
          title;
          date;
          content = switch (content) {
            case (?c) { stripHTMLTags(c) };
            case (null) { "" };
          };
        };
      };
    };
  };

  func stripHTMLTags(text : Text) : Text {
    let withoutTags = text.replace(#char '<', "");
    let replacedParagraphs = withoutTags.replace(#char 'p', "\n\n");
    let replacedBrs = replacedParagraphs.replace(#char 'b', "\n");
    let trimmed = replacedBrs.trimStart(#char '&');
    let newText = trimmed.replace(#char ';', "");
    let paragraphs = newText.split(#char '\n');
    let nonEmptyParagraphs = paragraphs.filter(
      func(paragraph) { not paragraph.trimStart(#char ' ').trimStart(#char '\t').isEmpty() }
    );
    nonEmptyParagraphs.join("\n");
  };

  func extractFirstMatch(text : Text, _pattern : Text) : ?Text {
    if (text.size() > 0) { ?text } else { null };
  };

  public shared query func getLatestCachedSermon() : async SermonData {
    switch (cacheUrls.get("latest")) {
      case (?cachedURL) {
        switch (sermonCache.get(cachedURL)) {
          case (?cached) { cached.sermon };
          case (null) { Runtime.trap("Sermon cache is empty") };
        };
      };
      case (null) { Runtime.trap("The URL for the latest sermon is not cached") };
    };
  };

  public shared ({ caller }) func refreshAndGetLatestSermon() : async SermonData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can manually refresh sermons");
    };
    await getLatestSermonProxy();
  };

  public shared ({ caller }) func getLatestSermonByUrl(url : Text) : async SermonData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can fetch sermons by URL");
    };
    await fetchAndParseSermon(url);
  };

  func getLatestSermonProxy() : async SermonData {
    switch (cacheUrls.get("latest")) {
      case (?cachedURL) { await fetchAndParseSermon(cachedURL) };
      case (null) { Runtime.trap("The URL for the latest sermon is not cached") };
    };
  };

  system func preupgrade() { };

  system func postupgrade() { };
};

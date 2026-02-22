import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access settings");
    };
    appSettings.get(caller);
  };

  public query ({ caller }) func getAppSettings(user : Principal) : async ?AppSettings {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    appSettings.get(user);
  };

  public shared ({ caller }) func saveCallerAppSettings(settings : AppSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
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

  public type AppRelease = {
    version : Text;
    storeUrl : Text;
    updatedAt : Time.Time;
  };

  var latestAppRelease : ?AppRelease = null;

  public shared ({ caller }) func updateLatestAppRelease(release : AppRelease) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the admin can update app releases");
    };
    latestAppRelease := ?release;
  };

  public query ({ caller }) func getLatestAppRelease() : async ?AppRelease {
    let _ignore = caller;
    latestAppRelease;
  };

  public shared ({ caller }) func fetchPrayerTimes(latitude : Text, longitude : Text, timestamp : Text, method : Text) : async Text {
    let _ignore = caller;
    let baseURL = "https://api.aladhan.com/v1/timings/" # timestamp;
    let url = baseURL # "?latitude=" # latitude # "&longitude=" # longitude # "&method=" # method;
    await OutCall.httpGetRequest(url, [], transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  system func preupgrade() {};
  system func postupgrade() {};
};

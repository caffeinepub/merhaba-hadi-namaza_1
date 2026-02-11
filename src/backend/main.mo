import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

};

import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    appSettings : Map.Map<Principal, {
      location : Text;
      offset : Text;
    }>;
  };

  type NewActor = {
    appSettings : Map.Map<Principal, {
      location : Text;
      offset : Text;
    }>;
    latestSermonCache : ?{
      title : ?Text;
      date : ?Text;
      content : Text;
    };
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      latestSermonCache = null;
    };
  };
};

module {
  type OldSermonData = {
    title : ?Text;
    date : ?Text;
    content : Text;
  };

  type OldActor = {
    latestSermonCache : ?OldSermonData;
    // Other defaults can be added here
  };

  // New actor type omitting the stable variable
  type NewActor = {};

  public func run(_oldState : OldActor) : NewActor {
    {};
  };
};

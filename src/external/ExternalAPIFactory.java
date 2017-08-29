package external;

public class ExternalAPIFactory {
  private static final String DEFAULT_PIPELINE = "ticketmaster";

  // Start different APIs based on the pipeline.
  // we use this factory pattern is used for creating API without directly accessing the secific API class
  // we might add more APIs, then we can just add new case here, so we can call from our searchItem method
  // rather than change the searchItem case by case
  public static ExternalAPI getExternalAPI(String pipeline) {
    switch (pipeline) {
      case "ticketmaster":
        return new TicketMasterAPI();
      default:
        throw new IllegalArgumentException("Invalid pipeline " + pipeline);
    }
  }

  public static ExternalAPI getExternalAPI() {
    return getExternalAPI(DEFAULT_PIPELINE);
  }
}

import EventFiltersSchema from "@receeve-gmbh/reporting-events-api/EventFilters.json";
import { Schema } from "@receeve-gmbh/validate";

export default function getClaimRefSchemas(): Record<string, Schema> {
  return {
    "EventFilters.json": EventFiltersSchema,
  };
}

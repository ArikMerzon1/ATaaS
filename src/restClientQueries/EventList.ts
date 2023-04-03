import * as events from "events";

export default interface EventList {
  page: number;
  limit: number;
  events: events[];
}

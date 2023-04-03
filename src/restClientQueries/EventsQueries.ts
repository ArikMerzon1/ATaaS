import { container, inject, injectable } from "tsyringe";
import { Message } from "@exness/emit-message";
import { HttpProvider } from "../utils/httpProvider";
import Helpers from "../utils/helpers";
import EventList from "./EventList";
import EventEmitter, { QueryFilters } from "../eventHelper/EventEmitter";

@injectable()
export default class EventsQueries {
  constructor(@inject(HttpProvider) private readonly httpProvider: HttpProvider) {}

  async getEvents(event: string): Promise<EventList> {
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() - 1);
    const date = dateNow.toISOString().split("T")[0];

    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.get(`${clientId}/get_events?eventType=${event}&date=${date}&limit=1000&page=1`);
    return result.data as EventList;
  }

  async getMessages(clientId: string, queryFilters: QueryFilters): Promise<AsyncGenerator<Message[]>> {
    const eventEmitter = container.resolve(EventEmitter);
    return eventEmitter.getMessages(clientId, queryFilters);
  }
}

import { IMessageEmitter } from "@receeve-gmbh/emit-message";
import { QueryEventsGet } from "@receeve-gmbh/reporting-events-api/query.events.get.v1";
import { EventsReponse } from "@receeve-gmbh/reporting-backoffice-api";
import QueryEventsGetSchema from "@receeve-gmbh/reporting-events-api/query.events.get.v1.json";
import logger from "@receeve-gmbh/logger";
import { inject, injectable } from "tsyringe";
import getClaimRefSchemas from "../utils/getClaimRefSchema";

const log = logger("services:EventEmitter");

@injectable()
export default class EventEmitter {
  constructor(
    @inject("messageEmitter") private readonly messageEmitter: IMessageEmitter,
    @inject("reportingEventEmitter") private readonly reportingEventEmitter: IMessageEmitter
  ) {}

  public async *getMessages<T>(clientId: string, filters: QueryFilters): AsyncGenerator<T[]> {
    let from = 0;

    const { messageTypes, batchSize = 100, emitTimeGreaterOrEqualThan, messageContainsStrings: rawMessageContainsStrings } = filters;

    let fetchedEventsAmount = 0;
    let queryEventsGetMessage: QueryEventsGet | undefined;

    try {
      do {
        queryEventsGetMessage = {
          attributes: {
            clientId,
            messageType: "query.events.get",
            messageVersion: "1",
          },
          payload: {
            from,
            messageTypes,
            rawMessageContainsStrings,
          },
        };

        if (emitTimeGreaterOrEqualThan && queryEventsGetMessage?.payload) {
          queryEventsGetMessage.payload.emitTimeGreaterOrEqualThan = emitTimeGreaterOrEqualThan;
        }

        if (batchSize && queryEventsGetMessage?.payload) {
          queryEventsGetMessage.payload.size = batchSize;
        }

        if (queryEventsGetMessage) {
          console.log("Executing getMessages", { queryEventsGetMessage });

          const { response: reports } = await this.reportingEventEmitter.emitWithResponse<QueryEventsGet, EventsReponse>(
            QueryEventsGetSchema,
            queryEventsGetMessage,
            {
              refSchemas: getClaimRefSchemas(),
            }
          );

          console.log("Direct call to Reporting-Events succeeded", {
            queryEventsGetMessage,
            reports,
          });

          if (reports) {
            const { events, totalEvents } = reports;

            if (!Array.isArray(events)) {
              throw new Error("Invalid shape of events");
            }

            fetchedEventsAmount = events.length;
            console.log("fetched events", {
              totalEvents,
              fetchedEventsAmount,
              queryEventsGetMessage,
            });

            yield events as unknown as T[];

            from += fetchedEventsAmount;
          }
        }
      } while (fetchedEventsAmount === batchSize);
    } catch (error) {
      log.error("Error during getMessages", { error, queryEventsGetMessage });
      throw Error(JSON.stringify(error, null, 2));
    }
  }
}

export interface QueryFilters {
  batchSize?: number;
  messageTypes: string[];
  messageContainsStrings: string[];
  emitTimeGreaterOrEqualThan?: number;
}

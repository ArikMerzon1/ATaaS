import logger from "@receeve-gmbh/logger";
import { Handler } from "@receeve-gmbh/sqs-handler";

import { EventTestSuiteSet } from "../../types/event.testSuite.set.v1";
import ITestSuiteDefinitionDAO from "../dao/ITestSuiteDefinitionDAO";

const log = logger("handlers:EventTestSuiteSetV1Handler");

export default class EventTestSuiteDefinitionSetV1Handler implements Handler<void> {
  public constructor(readonly testSuiteDefinitionDAO: ITestSuiteDefinitionDAO) {}

  public async processMessage(incomingMessage: EventTestSuiteSet): Promise<void> {
    const {
      attributes: { clientId },
      payload,
    } = incomingMessage;

    console.log("Processing message", { clientId });

    await this.testSuiteDefinitionDAO.upsert(clientId, payload);
  }
}

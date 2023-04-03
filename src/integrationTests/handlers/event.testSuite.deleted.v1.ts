import logger from "@exness/logger";
import { Handler } from "@exness/sqs-handler";

import { EventTestSuiteDelete } from "../../types/event.testSuite.deleted.v1";
import ITestSuiteDefinitionDAO from "../dao/ITestSuiteDefinitionDAO";

const log = logger("handlers:EventTestSuiteDeleteV1Handler");

export default class EventTestSuiteDeleteV1Handler implements Handler<void> {
  public constructor(readonly testSuiteDefinitionDAO: ITestSuiteDefinitionDAO) {}

  public async processMessage(incomingMessage: EventTestSuiteDelete): Promise<void> {
    const {
      attributes: { clientId },
      payload: { testSuiteId },
    } = incomingMessage;

    console.log("Processing message", { clientId, testSuiteId });

    await this.testSuiteDefinitionDAO.delete(clientId, testSuiteId);
  }
}

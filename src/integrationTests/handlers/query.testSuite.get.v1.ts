import logger from "@exness/logger";
import { Handler } from "@exness/sqs-handler";

import { QueryTestSuiteGet } from "../../types/query.testSuite.get.v1";
import ITestSuiteDefinitionDAO from "../dao/ITestSuiteDefinitionDAO";
import { TestSuite } from "../../types/TestSuite";

const log = logger("handlers:QueryTestSuiteGetV1Handler");

export default class QueryTestSuiteGetV1Handler implements Handler<TestSuite | null> {
  public constructor(readonly testSuiteDefinitionDAO: ITestSuiteDefinitionDAO) {}

  public async processMessage(incomingMessage: QueryTestSuiteGet): Promise<TestSuite | null> {
    const {
      attributes: { clientId },
      payload: { testSuiteId },
    } = incomingMessage;

    console.log("Processing message", { clientId, testSuiteId });

    return this.testSuiteDefinitionDAO.find(clientId, testSuiteId);
  }
}

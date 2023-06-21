import logger from "@receeve-gmbh/logger";
import { Handler } from "@receeve-gmbh/sqs-handler";

import { QueryTestSuiteListGet } from "../../types/query.testSuiteList.get.v1";
import ITestSuiteDefinitionDAO from "../dao/ITestSuiteDefinitionDAO";
import { TestSuite } from "../../types/TestSuite";

const log = logger("handlers:QueryTestSuiteListGetV1Handler");

export default class QueryTestSuiteListGetV1Handler implements Handler<TestSuite[]> {
  public constructor(readonly testSuiteDefinitionDAO: ITestSuiteDefinitionDAO) {}

  public async processMessage(incomingMessage: QueryTestSuiteListGet): Promise<TestSuite[]> {
    const {
      attributes: { clientId },
    } = incomingMessage;

    console.log("Processing message", { clientId });

    return this.testSuiteDefinitionDAO.findAll(clientId);
  }
}

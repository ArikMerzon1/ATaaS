import { Handler } from "@receeve-gmbh/sqs-handler";
import logger from "@receeve-gmbh/logger";

import { EventTestStepExecuted } from "../../types/event.testStep.executed.v1";
import IRunningTestSuiteDAO from "../dao/IRunningTestSuiteDAO";

const log = logger("handlers:EventTestSuiteExecutedV1Handler");

export default class EventTestSuiteExecutedV1Handler implements Handler<void> {
  public constructor(readonly runningTestSuiteDAO: IRunningTestSuiteDAO) {}

  public async processMessage(incomingMessage: EventTestStepExecuted): Promise<void> {
    console.log(`Processing message: ${incomingMessage}`);

    const {
      attributes: { clientId, externalClaimRef },
      payload: { stepName },
    } = incomingMessage;

    const testStep = await this.runningTestSuiteDAO.find(clientId, externalClaimRef, stepName);

    if (!testStep) {
      log.info("The test suite associated with this step has already finalized");
      return;
    }

    await this.runningTestSuiteDAO.update(clientId, { ...testStep, hasBeenReached: true });
  }
}

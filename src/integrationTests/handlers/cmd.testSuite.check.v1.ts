import { Handler } from "@exness/sqs-handler";
import { IMessageEmitter } from "@exness/emit-message";
import logger from "@exness/logger";

import { EventTestSuiteFailed } from "../../types/event.testSuite.failed.v1";
import EventTestSuiteFailedSchema from "../../apiMessages/event.testSuite.failed.v1.json";
import { EventTestSuiteSucceeded } from "../../types/event.testSuite.succeeded.v1";
import EventTestSuiteSucceededSchema from "../../apiMessages/event.testSuite.succeeded.v1.json";
import { CommandTestSuiteCheck } from "../../types/cmd.testSuite.check.v1";
import IRunningTestSuiteDAO from "../dao/IRunningTestSuiteDAO";
import getRefSchemas from "../helpers/getRefSchemas";

const log = logger("handlers:CmdTestSuiteCheckV1Handler");

export default class CmdTestSuiteCheckV1Handler implements Handler<void> {
  public constructor(readonly runningTestSuiteDAO: IRunningTestSuiteDAO, readonly messageEmitter: IMessageEmitter) {}

  public async processMessage(incomingMessage: CommandTestSuiteCheck): Promise<void> {
    const {
      payload: { testSuiteId, prefix },
      attributes: { clientId },
    } = incomingMessage;

    let allStepsReached = true;

    let testCaseName;
    let resultDetailsString;

    try {
      const testSuiteStepsGenerator = this.runningTestSuiteDAO.getRunningTestSuites(clientId, testSuiteId);

      for await (const testSuiteSteps of testSuiteStepsGenerator) {
        allStepsReached = allStepsReached && testSuiteSteps.every((step) => step.hasBeenReached);

        testCaseName = testSuiteSteps[0].testCaseName;
        resultDetailsString = testSuiteSteps.map((ts) => (ts.hasBeenReached ? `:white_check_mark: ${ts.stepName}` : `:fire: ${ts.stepName}`)).join("\n");

        if (!allStepsReached) {
          break;
        }
      }
    } catch (error) {
      log.error("Error loading running test suite steps", { error, testSuiteId });
      throw error;
    }

    if (allStepsReached) {
      await this.messageEmitter.emit<EventTestSuiteSucceeded>(
        EventTestSuiteSucceededSchema,
        {
          attributes: {
            clientId,
            messageVersion: "1",
            messageType: "event.testSuite.succeeded",
          },
          payload: {
            testSuiteId,
            testCaseName,
            resultDetailsString,
            ...(prefix ? { prefix } : {}),
          },
        },
        { prevMessage: incomingMessage, refSchemas: getRefSchemas() }
      );

      return;
    }

    await this.messageEmitter.emit<EventTestSuiteFailed>(
      EventTestSuiteFailedSchema,
      {
        attributes: {
          clientId,
          messageVersion: "1",
          messageType: "event.testSuite.failed",
        },
        payload: {
          testSuiteId,
          testCaseName,
          resultDetailsString,
          ...(prefix ? { prefix } : {}),
        },
      },
      { prevMessage: incomingMessage, refSchemas: getRefSchemas() }
    );
  }
}

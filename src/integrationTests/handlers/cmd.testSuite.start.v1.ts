import logger from "@receeve-gmbh/logger";
import { Handler } from "@receeve-gmbh/sqs-handler";
import { IMessageEmitter } from "@receeve-gmbh/emit-message";
import { Claim } from "@receeve-gmbh/account-api/Claim";
import { CommandClaimCreate } from "@receeve-gmbh/account-api/cmd.claim.create.v1";
import CommandClaimCreateSchema from "@receeve-gmbh/account-api/cmd.claim.create.v1.json";
import { CommandMessageSchedule } from "@receeve-gmbh/message-scheduler-api/cmd.message.schedule.v1";
import CommandMessageScheduleSchema from "@receeve-gmbh/message-scheduler-api/cmd.message.schedule.v1.json";

import moment from "moment";
import { v4 as uuidV4 } from "uuid";
import { EventTestSuiteStarted } from "../../types/event.testSuite.started.v1";
import { CommandTestSuiteStart } from "../../types/cmd.testSuite.start.v1";
import EventTestSuiteStartedSchema from "../../apiMessages/event.testSuite.started.v1.json";
import ITestSuiteDefinitionDAO from "../dao/ITestSuiteDefinitionDAO";
import getRefSchemas from "../helpers/getRefSchemas";
import RunningTestSuite from "../entities/RunningTestSuite";
import IRunningTestSuiteDAO from "../dao/IRunningTestSuiteDAO";

const log = logger("handlers:CmdTestSuiteStartV1Handler");

export default class CmdTestSuiteStartV1Handler implements Handler<void> {
  public constructor(
    readonly testSuiteDefinitionDAO: ITestSuiteDefinitionDAO,
    readonly runningTestSuiteDAO: IRunningTestSuiteDAO,
    readonly messageEmitter: IMessageEmitter
  ) {}

  public async processMessage(incomingMessage: CommandTestSuiteStart): Promise<void> {
    const {
      attributes,
      payload: { testSuiteId, prefix },
    } = incomingMessage;
    const { clientId } = attributes;

    const testSuite = await this.testSuiteDefinitionDAO.find(clientId, testSuiteId);

    if (!testSuite) {
      const error = "Test Suite definition with provided id not found";
      log.error(error, { clientId, testSuiteId });
      throw new Error(error);
    }

    const claim = testSuite.claim as unknown as Claim;
    const preparedTestCases = Object.entries(testSuite.testCases).reduce(
      (pV, [testCaseName, steps]) => ({
        ...pV,
        [testCaseName]: {
          id: `AT-${prefix ? `BO-${prefix}--` : ""}${uuidV4()}`,
          steps,
        },
      }),
      {} as EventTestSuiteStarted["payload"]["preparedTestCases"]
    );

    const runningTestSuiteSteps = Object.entries(preparedTestCases).reduce(
      (pV, [testCaseName, { id, steps }]) => [
        ...pV,
        ...steps.map((stepName) => ({
          id,
          clientId,
          testSuiteId,
          testCaseName,
          stepName,
          hasBeenReached: false,
          timeout: testSuite.timeout,
        })),
      ],
      [] as RunningTestSuite[]
    );

    // To avoid a race condition, running test cases need to be saved before calling cmd.claim.create
    await Promise.all(runningTestSuiteSteps.map((useCase) => this.runningTestSuiteDAO.upsert(clientId, useCase)));

    await Promise.all(
      Object.values(preparedTestCases).map((tc) =>
        this.messageEmitter.emit<CommandClaimCreate>(
          CommandClaimCreateSchema,
          {
            attributes: {
              externalClaimRef: tc.id,
              clientId,
              messageVersion: "1",
              messageType: "cmd.claim.create",
            },
            payload: {
              ...claim,
              externalClaimRef: tc.id,
            },
          },
          { prevMessage: incomingMessage, refSchemas: getRefSchemas() }
        )
      )
    );

    await this.messageEmitter.emit<EventTestSuiteStarted>(
      EventTestSuiteStartedSchema,
      {
        attributes: {
          clientId,
          messageVersion: "1",
          messageType: "event.testSuite.started",
        },
        payload: {
          preparedTestCases,
          ...(prefix ? { prefix } : {}),
        },
      },
      { prevMessage: incomingMessage, refSchemas: getRefSchemas() }
    );

    await this.messageEmitter.emit<CommandMessageSchedule>(
      CommandMessageScheduleSchema,
      {
        attributes: {
          clientId,
          messageVersion: "1",
          messageType: "cmd.message.schedule",
        },
        payload: {
          scheduledMessageAttributes: {
            clientId,
            messageVersion: "1",
            messageType: "cmd.testSuite.check",
          },
          scheduledMessagePayload: {
            testSuiteId,
            ...(prefix ? { prefix } : {}),
          },
          processAt: moment().add(testSuite.timeout).unix(),
        },
      },
      { prevMessage: incomingMessage, refSchemas: getRefSchemas() }
    );
  }
}

import CommandMessageScheduleSchema from "@receeve-gmbh/message-scheduler-api/cmd.message.schedule.v1.json";
import CommandClaimCreateSchema from "@receeve-gmbh/account-api/cmd.claim.create.v1.json";
import { MessageEmitter } from "@receeve-gmbh/emit-message";

import getRefSchemas from "../../helpers/getRefSchemas";
import { EventTestSuiteStarted } from "../../../types/event.testSuite.started.v1";
import { CommandTestSuiteStart } from "../../../types/cmd.testSuite.start.v1";
import CommandTestSuiteStartV1Handler from "../cmd.testSuite.start.v1";
import EventTestSuiteStartedSchema from "../../../apiMessages/event.testSuite.started.v1.json";
import IRunningTestSuiteDAO from "../../dao/IRunningTestSuiteDAO";
import ITestSuiteDefinitionDAO from "../../dao/ITestSuiteDefinitionDAO";
import RunningTestSuite from "../../entities/RunningTestSuite";
import TestSuiteFixture from "./testSuiteFixture.json";

const CLIENT_ID = "be4181ec-9940-43e4-a4f0-2a0fe6a2681f";
const TEST_SUITE_ID = TestSuiteFixture.testSuiteId;
const TEST_CASE_NAME = "Sends message";
const TEST_CASE_STEPS = ["Sends email", "Sends SMS"];

const MESSAGE: CommandTestSuiteStart = {
  attributes: {
    clientId: CLIENT_ID,
    messageVersion: "1",
    messageType: "cmd.testSuite.start",
  },
  payload: {
    testSuiteId: TEST_SUITE_ID,
  },
};

const PREPARED_TEST_SUITE_STEPS: EventTestSuiteStarted["payload"] = {
  preparedTestCases: {
    [TEST_CASE_NAME]: {
      id: expect.any(String),
      steps: TEST_CASE_STEPS,
    },
  },
};

const RUNNING_TEST_SUITE_STEPS: RunningTestSuite[] = TEST_CASE_STEPS.map((stepName) => ({
  id: expect.any(String),
  clientId: CLIENT_ID,
  testSuiteId: TEST_SUITE_ID,
  testCaseName: TEST_CASE_NAME,
  stepName,
  hasBeenReached: false,
  timeout: { hours: 2 },
}));

describe("Command Test Suite Start V1 Handler", () => {
  let handler: CommandTestSuiteStartV1Handler;
  let messageEmitter: MessageEmitter;
  let runningTestSuiteDAO: IRunningTestSuiteDAO;
  let testSuiteDefinitionDAO: ITestSuiteDefinitionDAO;

  beforeEach(() => {
    messageEmitter = new MessageEmitter({ dryRun: true });
    jest.spyOn(messageEmitter, "emit");

    runningTestSuiteDAO = {
      upsert: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      getRunningTestSuites: jest.fn(),
    };

    testSuiteDefinitionDAO = {
      upsert: jest.fn(),
      update: jest.fn(),
      find: jest.fn(async () => TestSuiteFixture),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    handler = new CommandTestSuiteStartV1Handler(testSuiteDefinitionDAO, runningTestSuiteDAO, messageEmitter);

    return handler.processMessage(MESSAGE);
  });

  test("It should request to find the Test Suite definition", () => {
    expect(testSuiteDefinitionDAO.find).toHaveBeenCalledWith(CLIENT_ID, TEST_SUITE_ID);
  });

  test("It should request to upsert the running Test Suite steps", () => {
    expect((runningTestSuiteDAO.upsert as jest.Mock).mock.calls).toEqual(RUNNING_TEST_SUITE_STEPS.map((step) => [CLIENT_ID, step]));
  });

  test("It should request emit cmd.claim.create", () => {
    expect(messageEmitter.emit).toHaveBeenCalledWith(
      CommandClaimCreateSchema,
      {
        attributes: {
          externalClaimRef: expect.any(String),
          clientId: CLIENT_ID,
          messageVersion: "1",
          messageType: "cmd.claim.create",
        },
        payload: {
          ...TestSuiteFixture.claim,
          externalClaimRef: expect.any(String),
        },
      },
      { prevMessage: MESSAGE, refSchemas: getRefSchemas() }
    );
  });

  test("It should request emit event.testSuite.started", () => {
    expect(messageEmitter.emit).toHaveBeenCalledWith(
      EventTestSuiteStartedSchema,
      {
        attributes: {
          clientId: CLIENT_ID,
          messageVersion: "1",
          messageType: "event.testSuite.started",
        },
        payload: PREPARED_TEST_SUITE_STEPS,
      },
      { prevMessage: MESSAGE, refSchemas: getRefSchemas() }
    );
  });

  test("It should request emit cmd.message.schedule", () => {
    expect(messageEmitter.emit).toHaveBeenCalledWith(
      CommandMessageScheduleSchema,
      {
        attributes: {
          clientId: CLIENT_ID,
          messageVersion: "1",
          messageType: "cmd.message.schedule",
        },
        payload: {
          scheduledMessageAttributes: {
            clientId: CLIENT_ID,
            messageVersion: "1",
            messageType: "cmd.testSuite.check",
          },
          scheduledMessagePayload: {
            testSuiteId: TEST_SUITE_ID,
          },
          processAt: expect.any(Number),
        },
      },
      { prevMessage: MESSAGE, refSchemas: getRefSchemas() }
    );
  });
});

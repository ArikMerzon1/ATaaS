import { MessageEmitter } from "@exness/emit-message";

import getRefSchemas from "../../helpers/getRefSchemas";
import { CommandTestSuiteCheck } from "../../../types/cmd.testSuite.check.v1";
import CommandTestSuiteCheckV1Handler from "../cmd.testSuite.check.v1";
import EventTestSuiteSucceededSchema from "../../../apiMessages/event.testSuite.succeeded.v1.json";
import EventTestSuiteFailedSchema from "../../../apiMessages/event.testSuite.failed.v1.json";
import IRunningTestSuiteDAO from "../../dao/IRunningTestSuiteDAO";
import RunningTestSuite from "../../entities/RunningTestSuite";

const CLIENT_ID = "be4181ec-9940-43e4-a4f0-2a0fe6a2681f";
const TEST_SUITE_ID = "fecd2d96-3ece-4a6c-a428-0929be3efede";

const MESSAGE: CommandTestSuiteCheck = {
  attributes: {
    clientId: CLIENT_ID,
    messageVersion: "1",
    messageType: "cmd.testSuite.check",
  },
  payload: {
    testSuiteId: TEST_SUITE_ID,
  },
};

const RUNNING_TEST_SUITE_STEP: RunningTestSuite = {
  id: "REF-0000",
  clientId: CLIENT_ID,
  testSuiteId: TEST_SUITE_ID,
  testCaseName: "Sends message",
  stepName: "Sends email",
  hasBeenReached: true,
  timeout: { minutes: 2 },
};

describe("Command Test Suite Check V1 Handler", () => {
  let handler: CommandTestSuiteCheckV1Handler;
  let messageEmitter: MessageEmitter;
  let runningTestSuiteDAO: IRunningTestSuiteDAO;

  beforeEach(() => {
    messageEmitter = new MessageEmitter({ dryRun: true });
    jest.spyOn(messageEmitter, "emit");

    runningTestSuiteDAO = {
      upsert: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      getRunningTestSuites: jest.fn(),
    };

    handler = new CommandTestSuiteCheckV1Handler(runningTestSuiteDAO, messageEmitter);
  });

  describe("Given a list of reached steps", () => {
    beforeEach(() => {
      (runningTestSuiteDAO.getRunningTestSuites as jest.Mock).mockImplementation(async function* executingTestSuite() {
        yield [RUNNING_TEST_SUITE_STEP];
        yield [RUNNING_TEST_SUITE_STEP];
      });

      return handler.processMessage(MESSAGE);
    });

    test("It should request emit event.testSuite.succeeded", () => {
      expect(messageEmitter.emit).toHaveBeenCalledWith(
        EventTestSuiteSucceededSchema,
        {
          attributes: {
            clientId: CLIENT_ID,
            messageVersion: "1",
            messageType: "event.testSuite.succeeded",
          },
          payload: {
            testCaseName: "Sends message",
            testSuiteId: TEST_SUITE_ID,
            resultDetailsString: ":white_check_mark: Sends email",
          },
        },
        { prevMessage: MESSAGE, refSchemas: getRefSchemas() }
      );
    });
  });

  describe("Given a list of unreached steps", () => {
    beforeEach(() => {
      (runningTestSuiteDAO.getRunningTestSuites as jest.Mock).mockImplementation(async function* executingTestSuite() {
        yield [RUNNING_TEST_SUITE_STEP];
        yield [
          {
            ...RUNNING_TEST_SUITE_STEP,
            hasBeenReached: false,
          },
        ];
      });

      return handler.processMessage(MESSAGE);
    });

    test("It should request emit event.testSuite.failed", () => {
      expect(messageEmitter.emit).toHaveBeenCalledWith(
        EventTestSuiteFailedSchema,
        {
          attributes: {
            clientId: CLIENT_ID,
            messageVersion: "1",
            messageType: "event.testSuite.failed",
          },
          payload: {
            testCaseName: "Sends message",
            testSuiteId: TEST_SUITE_ID,
            resultDetailsString: ":fire: Sends email",
          },
        },
        { prevMessage: MESSAGE, refSchemas: getRefSchemas() }
      );
    });
  });
});

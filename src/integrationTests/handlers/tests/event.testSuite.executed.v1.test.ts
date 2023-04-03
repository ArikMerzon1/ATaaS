import IRunningTestSuiteDAO from "../../dao/IRunningTestSuiteDAO";
import RunningTestSuite from "../../entities/RunningTestSuite";
import { EventTestStepExecuted } from "../../../types/event.testStep.executed.v1";
import EventTestStepExecutedV1Handler from "../event.testStep.executed.v1";

const CLIENT_ID = "be4181ec-9940-43e4-a4f0-2a0fe6a2681f";
const EXTERNAL_CLAIM_REF = "REF-0000";
const STEP_NAME = "Send email";

const MESSAGE: EventTestStepExecuted = {
  attributes: {
    externalClaimRef: EXTERNAL_CLAIM_REF,
    clientId: CLIENT_ID,
    messageVersion: "1",
    messageType: "event.testStep.executed",
  },
  payload: {
    stepName: STEP_NAME,
  },
};

const RUNNING_TEST_SUITE_STEP: RunningTestSuite = {
  id: EXTERNAL_CLAIM_REF,
  clientId: CLIENT_ID,
  testSuiteId: "ID",
  testCaseName: "Sends message",
  stepName: STEP_NAME,
  hasBeenReached: false,
  timeout: { minutes: 2 },
};

describe("Event Test Suite Executed V1 Handler", () => {
  let handler: EventTestStepExecutedV1Handler;
  let runningTestSuiteDAO: IRunningTestSuiteDAO;

  beforeEach(() => {
    runningTestSuiteDAO = {
      upsert: jest.fn(),
      update: jest.fn(),
      find: jest.fn(async () => RUNNING_TEST_SUITE_STEP),
      getRunningTestSuites: jest.fn(),
    };

    handler = new EventTestStepExecutedV1Handler(runningTestSuiteDAO);

    return handler.processMessage(MESSAGE);
  });

  test("It should request to find the running Test Suite step", () => {
    expect(runningTestSuiteDAO.find).toHaveBeenCalledWith(CLIENT_ID, EXTERNAL_CLAIM_REF, STEP_NAME);
  });

  test("It should request to update the running Test Suite step", () => {
    expect(runningTestSuiteDAO.update).toHaveBeenCalledWith(CLIENT_ID, {
      ...RUNNING_TEST_SUITE_STEP,
      hasBeenReached: true,
    });
  });
});

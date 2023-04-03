import ITestSuiteDefinitionDAO from "../../dao/ITestSuiteDefinitionDAO";
import { EventTestSuiteSet } from "../../../types/event.testSuite.set.v1";
import EventTestSuiteSetV1Handler from "../event.testSuite.set.v1";
import TestSuiteFixture from "./testSuiteFixture.json";

const CLIENT_ID = "be4181ec-9940-43e4-a4f0-2a0fe6a2681f";

const MESSAGE: EventTestSuiteSet = {
  attributes: {
    clientId: CLIENT_ID,
    messageVersion: "1",
    messageType: "event.testSuite.set",
  },
  payload: TestSuiteFixture,
};

describe("Event Test Suite Set V1 Handler", () => {
  let handler: EventTestSuiteSetV1Handler;
  let testSuiteDefinitionDAO: ITestSuiteDefinitionDAO;

  beforeEach(() => {
    testSuiteDefinitionDAO = {
      upsert: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    handler = new EventTestSuiteSetV1Handler(testSuiteDefinitionDAO);

    return handler.processMessage(MESSAGE);
  });

  test("It should request to store the Test Suite definition", () => {
    expect(testSuiteDefinitionDAO.upsert).toHaveBeenCalledWith(CLIENT_ID, TestSuiteFixture);
  });
});

import ITestSuiteDefinitionDAO from "../../dao/ITestSuiteDefinitionDAO";
import { EventTestSuiteDelete } from "../../../types/event.testSuite.deleted.v1";
import EventTestSuiteDeleteV1Handler from "../event.testSuite.deleted.v1";

const CLIENT_ID = "be4181ec-9940-43e4-a4f0-2a0fe6a2681f";
const TEST_SUITE_ID = "fecd2d96-3ece-4a6c-a428-0929be3efede";

const MESSAGE: EventTestSuiteDelete = {
  attributes: {
    clientId: CLIENT_ID,
    messageVersion: "1",
    messageType: "event.testSuite.deleted",
  },
  payload: {
    testSuiteId: TEST_SUITE_ID,
  },
};

describe("Event Test Suite Delete V1 Handler", () => {
  let handler: EventTestSuiteDeleteV1Handler;
  let testSuiteDefinitionDAO: ITestSuiteDefinitionDAO;

  beforeEach(() => {
    testSuiteDefinitionDAO = {
      upsert: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    handler = new EventTestSuiteDeleteV1Handler(testSuiteDefinitionDAO);

    return handler.processMessage(MESSAGE);
  });

  test("It should request to delete the Test Suite definition", () => {
    expect(testSuiteDefinitionDAO.delete).toHaveBeenCalledWith(CLIENT_ID, TEST_SUITE_ID);
  });
});

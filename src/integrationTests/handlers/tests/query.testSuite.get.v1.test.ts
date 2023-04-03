import ITestSuiteDefinitionDAO from "../../dao/ITestSuiteDefinitionDAO";
import { QueryTestSuiteGet } from "../../../types/query.testSuite.get.v1";
import QueryTestSuiteGetV1Handler from "../query.testSuite.get.v1";
import { TestSuite } from "../../../types/TestSuite";
import TestSuiteFixture from "./testSuiteFixture.json";

const CLIENT_ID = "be4181ec-9940-43e4-a4f0-2a0fe6a2681f";
const TEST_SUITE_ID = TestSuiteFixture.testSuiteId;

const MESSAGE: QueryTestSuiteGet = {
  attributes: {
    clientId: CLIENT_ID,
    messageVersion: "1",
    messageType: "query.testSuite.get",
  },
  payload: {
    testSuiteId: TEST_SUITE_ID,
  },
};

describe("Query Test Suite Get V1 Handler", () => {
  let handler: QueryTestSuiteGetV1Handler;
  let testSuiteDefinitionDAO: ITestSuiteDefinitionDAO;
  let result: TestSuite | null;

  beforeEach(async () => {
    testSuiteDefinitionDAO = {
      upsert: jest.fn(),
      update: jest.fn(),
      find: jest.fn(async () => TestSuiteFixture),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    handler = new QueryTestSuiteGetV1Handler(testSuiteDefinitionDAO);
    result = await handler.processMessage(MESSAGE);

    return result;
  });

  test("It should request to get a Test Suite definition", () => {
    expect(testSuiteDefinitionDAO.find).toHaveBeenCalledWith(CLIENT_ID, TEST_SUITE_ID);
  });

  test("It should return a Test Suite definition", () => {
    expect(result).toEqual(TestSuiteFixture);
  });
});

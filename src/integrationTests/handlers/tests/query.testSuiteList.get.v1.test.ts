import ITestSuiteDefinitionDAO from "../../dao/ITestSuiteDefinitionDAO";
import { QueryTestSuiteListGet } from "../../../types/query.testSuiteList.get.v1";
import QueryTestSuiteListGetV1Handler from "../query.testSuiteList.get.v1";
import { TestSuite } from "../../../types/TestSuite";
import TestSuiteFixture from "./testSuiteFixture.json";

const CLIENT_ID = "be4181ec-9940-43e4-a4f0-2a0fe6a2681f";

const MESSAGE: QueryTestSuiteListGet = {
  attributes: {
    clientId: CLIENT_ID,
    messageVersion: "1",
    messageType: "query.testSuiteList.get",
  },
  payload: {},
};

describe("Query Test Suite List Get V1 Handler", () => {
  let handler: QueryTestSuiteListGetV1Handler;
  let testSuiteDefinitionDAO: ITestSuiteDefinitionDAO;
  let result: TestSuite[];

  beforeEach(async () => {
    testSuiteDefinitionDAO = {
      upsert: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(async () => [TestSuiteFixture]),
      delete: jest.fn(),
    };

    handler = new QueryTestSuiteListGetV1Handler(testSuiteDefinitionDAO);
    result = await handler.processMessage(MESSAGE);

    return result;
  });

  test("It should request to get Test Suite definitions", () => {
    expect(testSuiteDefinitionDAO.findAll).toHaveBeenCalledWith(CLIENT_ID);
  });

  test("It should return Test Suite definitions", () => {
    expect(result).toEqual([TestSuiteFixture]);
  });
});

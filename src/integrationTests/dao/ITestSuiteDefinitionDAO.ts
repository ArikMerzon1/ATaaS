import TestSuite from "../entities/TestSuite";

export default interface ITestSuiteDefinitionDAO {
  upsert(clientId: string, data: TestSuite): Promise<void>;

  update(clientId: string, data: TestSuite): Promise<void>;

  find(clientId: string, testSuiteId: string): Promise<TestSuite | null>;

  findAll(clientId: string): Promise<TestSuite[]>;

  delete(clientId: string, testSuiteId: string): Promise<void>;
}

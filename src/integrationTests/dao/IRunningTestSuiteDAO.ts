import RunningTestSuite from "../entities/RunningTestSuite";

export default interface IRunningTestSuiteDAO {
  upsert(clientId: string, data: RunningTestSuite): Promise<void>;

  update(clientId: string, data: RunningTestSuite): Promise<void>;

  find(clientId: string, externalClaimRef: string, stepName: string): Promise<RunningTestSuite | null>;

  getRunningTestSuites(clientId: string, testSuiteId: string): AsyncGenerator<RunningTestSuite[]>;
}

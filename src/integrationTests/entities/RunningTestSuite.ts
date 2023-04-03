import { DurationInputObject } from "moment";

export default interface RunningTestSuite {
  id: string;
  clientId: string;
  testSuiteId: string;
  testCaseName: string;
  stepName: string;
  hasBeenReached: boolean;
  timeout: DurationInputObject;
}

export interface SerializedRunningTestSuite extends Omit<RunningTestSuite, "id"> {
  clientIdANDExternalClaimRef: string;
  expiresAt?: number;
}

export interface RunningTestSuiteContext {
  clientId: string;
}

import { TestSuite } from "../../types/TestSuite";

export default TestSuite;

export interface TestSuiteContext {
  clientId: string;
  externalClaimRef?: string;
}

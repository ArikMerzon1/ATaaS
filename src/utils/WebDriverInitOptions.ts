import { TestExecutor } from "./Enums";

export default interface WebDriverInitOptions {
  executor: TestExecutor;
  browser: string;
  url: string;
  headless: boolean;
  timeout?: number;
  suitName?: string;
}

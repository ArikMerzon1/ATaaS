import { Event } from "jest-circus";
import { TestEnvironment as NodeEnvironment } from "jest-environment-node";

export default class CustomEnvironment extends NodeEnvironment {
  handleTestEvent(event: Event): void {
    if (!this.global.testStatuses) this.global.testStatuses = {};
    const testName = event.name;

    let testStatuses = {};

    switch (event.name) {
      case "test_fn_failure":
        testStatuses = {
          [testName]: {
            status: "failed",
          },
        };

        break;
      case "error":
        testStatuses = {
          [testName]: {
            status: "error",
            error: event.error,
          },
        };

        break;
      case "test_fn_success":
        testStatuses = {
          [testName]: {
            status: "passed",
          },
        };
        break;

      default:
        break;
    }

    this.global.testStatuses = {
      ...this.global.testStatuses,
      ...testStatuses,
    };
  }
}

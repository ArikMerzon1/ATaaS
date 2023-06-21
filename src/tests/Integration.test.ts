import "reflect-metadata";
import { suite, test, timeout } from "@testdeck/jest";

import AbstractTestBase from "./AbstractTestBase";

import { CommandTestSuiteStart } from "../types/cmd.testSuite.start.v1";
import CmdTestSuiteStartV1Handler from "../integrationTests/handlers/cmd.testSuite.start.v1";
import { integrationHandlers } from "../integrationTests/assembly";

@suite("uitests")
class IntegrationTest {
  @test("IntegrationTest")
  @timeout(AbstractTestBase.timeOut)
  async IntegrationTest(): Promise<void> {
    const CLIENT_ID = "3d132b18-6b6f-4f7c-b464-6a8ee7ca5235";
    const TEST_SUITE_ID = "08d3e614-e247-4966-aa65-3bd43ada833a";

    const MESSAGE: CommandTestSuiteStart = {
      attributes: {
        clientId: CLIENT_ID,
        messageVersion: "1",
        messageType: "cmd.testSuite.start",
      },
      payload: {
        testSuiteId: TEST_SUITE_ID,
      },
    };

    const command = integrationHandlers["cmd.testSuite.start.v1"] as CmdTestSuiteStartV1Handler;
    await command.processMessage(MESSAGE);
  }
}

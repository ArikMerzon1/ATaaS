import { MessageEmitter } from "@receeve-gmbh/emit-message";

import getRefSchemas from "../../helpers/getRefSchemas";
import { CommandTestSuiteDelete } from "../../../types/cmd.testSuite.delete.v1";
import CommandTestSuiteDeleteV1Handler from "../cmd.testSuite.delete.v1";
import EventTestSuiteDeleteSchema from "../../../apiMessages/event.testSuite.deleted.v1.json";

const CLIENT_ID = "be4181ec-9940-43e4-a4f0-2a0fe6a2681f";
const TEST_SUITE_ID = "fecd2d96-3ece-4a6c-a428-0929be3efede";

const MESSAGE: CommandTestSuiteDelete = {
  attributes: {
    clientId: CLIENT_ID,
    messageVersion: "1",
    messageType: "event.testSuite.deleted",
  },
  payload: {
    testSuiteId: TEST_SUITE_ID,
  },
};

describe("Command Test Suite Delete V1 Handler", () => {
  let messageEmitter: MessageEmitter;
  let handler: CommandTestSuiteDeleteV1Handler;

  beforeEach(() => {
    messageEmitter = new MessageEmitter({ dryRun: true });
    jest.spyOn(messageEmitter, "emit");

    handler = new CommandTestSuiteDeleteV1Handler(messageEmitter);

    return handler.processMessage(MESSAGE);
  });

  test("It should request emit event.testSuite.deleted", () => {
    expect(messageEmitter.emit).toHaveBeenCalledWith(
      EventTestSuiteDeleteSchema,
      {
        attributes: {
          clientId: CLIENT_ID,
          messageVersion: "1",
          messageType: "event.testSuite.deleted",
        },
        payload: {
          testSuiteId: TEST_SUITE_ID,
        },
      },
      { prevMessage: MESSAGE, refSchemas: getRefSchemas() }
    );
  });
});

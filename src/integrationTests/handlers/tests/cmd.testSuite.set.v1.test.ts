import { MessageEmitter } from "@exness/emit-message";

import getRefSchemas from "../../helpers/getRefSchemas";
import { CommandTestSuiteSet } from "../../../types/cmd.testSuite.set.v1";
import CommandTestSuiteSetV1Handler from "../cmd.testSuite.set.v1";
import EventTestSuiteSetSchema from "../../../apiMessages/event.testSuite.set.v1.json";
import TestSuiteFixture from "./testSuiteFixture.json";

const CLIENT_ID = "be4181ec-9940-43e4-a4f0-2a0fe6a2681f";

const MESSAGE: CommandTestSuiteSet = {
  attributes: {
    clientId: CLIENT_ID,
    messageVersion: "1",
    messageType: "cmd.testSuite.set",
  },
  payload: TestSuiteFixture,
};

describe("Command Test Suite Set V1 Handler", () => {
  let messageEmitter: MessageEmitter;
  let handler: CommandTestSuiteSetV1Handler;

  beforeEach(() => {
    messageEmitter = new MessageEmitter({ dryRun: true });
    jest.spyOn(messageEmitter, "emit");

    handler = new CommandTestSuiteSetV1Handler(messageEmitter);

    return handler.processMessage(MESSAGE);
  });

  test("It should request emit event.testSuite.set", () => {
    expect(messageEmitter.emit).toHaveBeenCalledWith(
      EventTestSuiteSetSchema,
      {
        attributes: {
          clientId: CLIENT_ID,
          messageVersion: "1",
          messageType: "event.testSuite.set",
        },
        payload: TestSuiteFixture,
      },
      { prevMessage: MESSAGE, refSchemas: getRefSchemas() }
    );
  });
});

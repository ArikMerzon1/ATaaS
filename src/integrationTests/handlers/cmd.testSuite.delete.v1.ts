import logger from "@receeve-gmbh/logger";
import { Handler } from "@receeve-gmbh/sqs-handler";
import { IMessageEmitter } from "@receeve-gmbh/emit-message";

import { CommandTestSuiteDelete } from "../../types/cmd.testSuite.delete.v1";
import { EventTestSuiteDelete } from "../../types/event.testSuite.deleted.v1";
import EventTestSuiteDeleteSchema from "../../apiMessages/event.testSuite.deleted.v1.json";
import getRefSchemas from "../helpers/getRefSchemas";

const log = logger("handlers:CmdTestSuiteDeleteV1Handler");

export default class CmdTestSuiteDeleteV1Handler implements Handler<void> {
  public constructor(readonly messageEmitter: IMessageEmitter) {}

  public async processMessage(incomingMessage: CommandTestSuiteDelete): Promise<void> {
    const { attributes, payload } = incomingMessage;
    const { clientId } = attributes;

    console.log("Processing message", { attributes });

    await this.messageEmitter.emit<EventTestSuiteDelete>(
      EventTestSuiteDeleteSchema,
      {
        attributes: {
          clientId,
          messageVersion: "1",
          messageType: "event.testSuite.deleted",
        },
        payload,
      },
      { prevMessage: incomingMessage, refSchemas: getRefSchemas() }
    );
  }
}

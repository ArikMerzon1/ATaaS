import logger from "@exness/logger";
import { Handler } from "@exness/sqs-handler";
import { isValidBySpec } from "@exness/validate";
import { IMessageEmitter } from "@exness/emit-message";
import ClaimSchema from "@exness/account-api/Claim.json";
import lOmit from "lodash.omit";

import { CommandTestSuiteSet } from "../../types/cmd.testSuite.set.v1";
import { EventTestSuiteSet } from "../../types/event.testSuite.set.v1";
import EventTestSuiteSetSchema from "../../apiMessages/event.testSuite.set.v1.json";
import getRefSchemas from "../helpers/getRefSchemas";

const log = logger("handlers:CmdTestSuiteSetV1Handler");

export default class CmdTestSuiteSetV1Handler implements Handler<void> {
  public constructor(readonly messageEmitter: IMessageEmitter) {}

  public async processMessage(incomingMessage: CommandTestSuiteSet): Promise<void> {
    const { attributes, payload } = incomingMessage;
    const { clientId } = attributes;
    const { claim } = payload;

    console.log("Processing message", { attributes });

    if (!isValidBySpec(ClaimSchema, claim, lOmit(getRefSchemas(), "Claim.json"))) {
      log.error("Not a valid claim", { clientId, claim });
      throw new Error("Not a valid claim");
    }

    await this.messageEmitter.emit<EventTestSuiteSet>(
      EventTestSuiteSetSchema,
      {
        attributes: {
          clientId,
          messageVersion: "1",
          messageType: "event.testSuite.set",
        },
        payload,
      },
      { prevMessage: incomingMessage, refSchemas: getRefSchemas() }
    );
  }
}

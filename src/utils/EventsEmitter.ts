import { injectable } from "tsyringe";
import { SNS } from "aws-sdk";
import { SNSMessageEmitter } from "@receeve-gmbh/emit-message";
import logger from "@receeve-gmbh/logger";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import dummyJson from "dummy-json";

import { CommandClaimCreate } from "@receeve-gmbh/account-api/cmd.claim.create.v1";
import CommandClaimCreateSchema from "@receeve-gmbh/account-api/cmd.claim.create.v1.json";

import { isValidBySpec, getErrorsBySpec } from "@receeve-gmbh/validate";

import { CommandStrategyReassign } from "@receeve-gmbh/strategy-api/cmd.strategy.reassign.v1";
import CommandStrategyReassignSchema from "@receeve-gmbh/strategy-api/cmd.strategy.reassign.v1.json";
import { ClaimListItem } from "@receeve-gmbh/reporting-backoffice-api";
import helpers from "./helpers";
import getRefSchemas from "./getRefSchemas";

const sns: SNS = new SNS();
const log = logger("handlers:GenerateClaims");

injectable();
export class EventsEmitter {
  private messageEmitter: SNSMessageEmitter = new SNSMessageEmitter({ sns });

  async assignNewStrategy(claimListItem: ClaimListItem, newStrategyId: string): Promise<void> {
    try {
      await this.messageEmitter.emit<CommandStrategyReassign>(CommandStrategyReassignSchema, {
        attributes: {
          messageType: "cmd.strategy.reassign",
          messageVersion: "1",
          clientId: claimListItem.clientId,
          externalClaimRef: claimListItem.externalClaimRef,
        },
        payload: {
          strategyBlueprintId: newStrategyId,
          force: true,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async emitClaims(newClaim: CommandClaimCreate): Promise<void> {
    console.log("emitting msg");
    newClaim.attributes.accountId = `AUT-${uuidv4()}`;
    console.log(`Client ID: ${newClaim.attributes.clientId}`);
    console.log(`Account ID: ${newClaim.attributes.accountId}`);

    const newClaimA2 = await this.generateChainedClaim(newClaim, 15);
    console.log(`New claim: ${JSON.stringify(newClaim)}`);
    // console.log(getRefSchemas());
    if (isValidBySpec(CommandClaimCreateSchema, newClaimA2, getRefSchemas())) {
      await this.messageEmitter.emit<CommandClaimCreate>(CommandClaimCreateSchema, newClaimA2, {
        refSchemas: getRefSchemas(),
      });
    } else {
      console.log(getErrorsBySpec(CommandClaimCreateSchema, newClaimA2, getRefSchemas()));
    }
  }

  private async generateChainedClaim(originalClaim: CommandClaimCreate, daysPrior: number): Promise<CommandClaimCreate> {
    const newClaim = originalClaim;
    const amount = helpers.getRandomNumberBetween(10000, 250000);
    const totalFees = Math.floor(amount * (helpers.getRandomNumberBetween(1, 3) * 0.1));
    // Set up a due date within 90 days
    const dueDate = moment()
      .subtract(45 - daysPrior, "days")
      .format("YYYY-MM-DD");
    // Generate a external claim ref
    const externalClaimRef = `dd-${moment().format("YYYY-MM-DD")}_${dueDate}-${Math.floor(Math.random() * 100000)}`;
    const newPortfolioRef = this.getAPortfolioRef(originalClaim.attributes.clientId);

    // Update the fields for a new claim on the same person
    newClaim.payload.amount = amount;
    newClaim.payload.totalFees = totalFees;
    newClaim.attributes.externalClaimRef = externalClaimRef;
    newClaim.payload.externalClaimRef = externalClaimRef;
    newClaim.payload.externalPortfolioRef = newPortfolioRef;
    newClaim.payload.dueDate = dueDate;
    newClaim.payload.productReference = `PR_${helpers.getRandomNumberBetween(1000, 999999)}`;

    log.info(`product reference: ${newClaim.payload.productReference}`);
    return newClaim;
  }

  private getAPortfolioRef(clientId: string): string {
    const myOptions = ["Cards", "Personal Loan", "Overdraft"];
    const bankOptions = ["Cards", "Personal Loan", "Overdraft"];
    const utilityOptions = ["Nature Power24", "Easy Plan12", "Nature Power12"];
    switch (clientId) {
      case "be6c5d69-365e-42ad-94d3-052ada3a2aaa":
        // Bank Case
        return myOptions[Math.floor(Math.random() * myOptions.length)];
      case "0634543a-b912-45df-8860-000000000001":
        // Bank Case
        return bankOptions[Math.floor(Math.random() * bankOptions.length)];
      case "0634543a-b912-45df-8860-000000000002":
        // Utility Case
        return utilityOptions[Math.floor(Math.random() * utilityOptions.length)];
      default:
        return "Credit Card";
    }
  }

  private createDummyJson(json: JSON): unknown {
    const newClaimAsString = JSON.stringify(json);
    const result = dummyJson.parse(newClaimAsString);
    return JSON.parse(result);
  }
}

export default { EventsEmitter };

export interface ClaimGeneratorForm {
  numberOfAccountsToCreateMin?: number;
  numberOfAccountsToCreateMax?: number;
  claimResolve?: Segmentation[];
  claimCreate: CommandClaimCreate;
}

export interface Segmentation {
  dpd: number;
  percentage: number;
}

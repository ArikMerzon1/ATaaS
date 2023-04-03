import { PaymentProvider } from "../utils/Enums";

export default interface RecurringPaymentMandate {
  mandateId: string;
  clientId: string;
  accountId: string;
  providerName: PaymentProvider;
  createdAt: string;
  isDisabled?: boolean;
  disabledUntil?: string;

  /**
   * The value which can be used to have a context connection to primitive string value.
   * To that value DynamoDB-table GlobalSecondaryIndex (GSI) is connected and
   * we can pass contextRelationType (not implemented) to cmd.recurringPaymentMandate.charge to pick the mandate by contextRelationType.
   * Example: mandate is created in connection to the Instalment, and we want later charge especially that mandate from Strategy,
   * in that case we pass value "instalment-{UUID}" to contextRelationType and store it in Dynamo. From strategy with the appropriate step
   * we can pass value-chunk "instalment", and make some Finance-Payments handler to find the latest Mandate by "instalment" given.
   * Or it may be stored only as "instalment" (without UUID suffix), if needed. Depends on the useCase.
   * Important that contextRelationType is a string, so Dynamo-GSI can be connected to it, so we can search for the mandate we want using GSI.
   */
  contextRelationType?: string;

  context?: {
    externalDebtorRef?: string;
    email?: string;

    productReferences?: string[];

    [s: string]: unknown;
    clientIpAddress?: string;
  };
}

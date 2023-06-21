/* eslint-disable prettier/prettier */
import AWS, { Lambda, SNS } from "aws-sdk";
import { SNSMessageEmitter, LambdaMessageEmitter } from "@receeve-gmbh/emit-message";
import { container, inject, injectable } from "tsyringe";
import AccountMandatesQueries from "../restClientQueries/AccountMandatesQueries";
import AccountQueries from "../restClientQueries/AccountQueries";
import ClaimQueries from "../restClientQueries/ClaimQueries";
import EventsQueries from "../restClientQueries/EventsQueries";
import LandingPageQueries from "../restClientQueries/LandingPageQueries";
import LedgerEntriesQueries from "../restClientQueries/LedgerEntriesQueries";
import PaymentQueries from "../restClientQueries/PaymentQueries";
import ProductsQueries from "../restClientQueries/ProductsQueries";
import TestQueries from "../restClientQueries/TestQueries";
import AwsCognitoSetup from "../utils/AwsCognitoSetup";
import Helpers from "../utils/helpers";

@injectable()
export default class RestClientBootstrapper {
  private readonly messageEmitter: SNSMessageEmitter;
  private readonly reportingEventEmitter: LambdaMessageEmitter;
  private readonly baseUrl: string;
  private readonly clientId: string;

  constructor(
    @inject(AccountMandatesQueries) readonly accountMandatesQueries: AccountMandatesQueries,
    @inject(AccountQueries) readonly accountQueries: AccountQueries,
    @inject(AwsCognitoSetup) readonly awsCognitoSetup: AwsCognitoSetup,
    @inject(ClaimQueries) readonly claimQueries: ClaimQueries,
    @inject(EventsQueries) readonly eventsQueries: EventsQueries,
    @inject(LandingPageQueries) readonly landingPageQueries: LandingPageQueries,
    @inject(LedgerEntriesQueries) readonly ledgerEntriesQueries: LedgerEntriesQueries,
    @inject(PaymentQueries) readonly paymentQueries: PaymentQueries,
    @inject(ProductsQueries) readonly productsQueries: ProductsQueries,
    @inject(TestQueries) readonly testQueries: TestQueries
  ) {
    const sns: SNS = new SNS();
    const lambda = new Lambda({
      httpOptions: { connectTimeout: 40000, timeout: 38000 },
    });

    this.messageEmitter = new SNSMessageEmitter({ sns });
    this.reportingEventEmitter = new LambdaMessageEmitter({
      lambdaClient: lambda,
      lambdaFunctionName: process.env.REPORTING_EVENTS_DIRECT_LAMBDA_NAME as string,
    });

    this.baseUrl = Helpers.getValue(process.env.BASE_REST_API) as string;
    this.clientId = Helpers.getValue(process.env.TEST_CLIENT_ID) as string;

    container.register("messageEmitter", { useValue: this.messageEmitter });
    container.register("reportingEventEmitter", { useValue: this.reportingEventEmitter });
    container.register("baseUrl", { useValue: this.baseUrl });
    container.register("clientId", { useValue: this.clientId });
  }
}

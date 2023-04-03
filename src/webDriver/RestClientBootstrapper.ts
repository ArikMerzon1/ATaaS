/* eslint-disable prettier/prettier */
import { container, inject, injectable } from "tsyringe";
import { SNS } from "aws-sdk";
import { MessageEmitter } from "@receeve-gmbh/emit-message";
import AccountQueries from "../restClientQueries/AccountQueries";
import Helpers from "../utils/helpers";
import ClaimQueries from "../restClientQueries/ClaimQueries";
import EventsQueries from "../restClientQueries/EventsQueries";
import LandingPageQueries from "../restClientQueries/LandingPageQueries";
import PaymentQueries from "../restClientQueries/PaymentQueries";
import AwsCognitoSetup from "../utils/AwsCognitoSetup";
import LedgerEntriesQueries from "../restClientQueries/LedgerEntriesQueries";
import ProductsQueries from "../restClientQueries/ProductsQueries";
import AccountMandatesQueries from "../restClientQueries/AccountMandatesQueries";
import TestQueries from "../restClientQueries/TestQueries";

@injectable()
export default class RestClientBootstrapper {
  private readonly messageEmitter: MessageEmitter;
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
    this.messageEmitter = new MessageEmitter({ sns });
    this.baseUrl = Helpers.getValue(process.env.BASE_REST_API) as string;
    this.clientId = Helpers.getValue(process.env.TEST_CLIENT_ID) as string;

    container.register("messageEmitter", { useValue: this.messageEmitter });
    container.register("baseUrl", { useValue: this.baseUrl });
    container.register("clientId", { useValue: this.clientId });
  }
}

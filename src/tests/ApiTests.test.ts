/* eslint-disable */
import { v4 as uuidV4 } from "uuid";
import { suite, test, timeout } from "@testdeck/jest";
import Helpers from "../utils/helpers";
import AbstractTestBase from "./AbstractTestBase";
import EventList from "../restClientQueries/EventList";
import { Events, UserRoleCognito } from "../utils/Enums";
import { QueryFilters } from "../eventHelper/EventEmitter";
import { fetchClaimData } from "../utils/graphql/account/account.service";

@suite("apitests")
class ApiTests extends AbstractTestBase {
  readonly clientId: string;
  readonly externalClaimReference: string;
  readonly otherClientId: string;

  public constructor() {
    super();

    this.clientId = process.env.TEST_CLIENT_ID || "3d132b18-6b6f-4f7c-b464-6a8ee7ca5235";
    this.externalClaimReference = uuidV4();
    this.otherClientId = "be6c5d69-365e-42ad-94d3-052ada3a2aaa";
  }

  @test
  @timeout(AbstractTestBase.timeOut)
  async ApiCreateUserTest(): Promise<void> {
    const user = {
      attributes: {
        email: `arik.merzon+${Helpers.getRandomNumberBetween(10, 1000000)}@exness.com`,
        name: "test_name",
        family_name: "test_family",
        email_verified: "true",
      },
      groups: [`${this.clientId}${UserRoleCognito.AGENT}`],
    };

    const cognito = await this.withRestClient().awsCognitoSetup.cognitoSetup(user);
    console.log((await cognito.create(user)).userId);
  }

  @test
  @timeout(AbstractTestBase.timeOut)
  async PDN_4008_ApiAddLedgerEntriesTest(): Promise<void> {
    const ledgerEntryReference = uuidV4();
    const accountReference = await this.withRestClient().accountQueries.createAccounts();

    // Add Claims through the Ledger Entries
    await this.withRestClient().ledgerEntriesQueries.addAccountLedgerEntries(accountReference, ledgerEntryReference, 1000, {
      year: "2022",
      month: "09",
      day: "11",
    });
    await Helpers.sleep(10);
    const accountWithClaims = await this.withRestClient().accountQueries.getAccountClaims(accountReference);
    expect(accountWithClaims).toHaveLength(1);

    // Delete the Claims through the Ledger Entries
    await this.withRestClient().ledgerEntriesQueries.deleteAccountLedgerEntries(accountReference, ledgerEntryReference);
    await Helpers.sleep(10);
    const accountWithoutClaims = await this.withRestClient().accountQueries.getAccountClaims(accountReference);
    expect(accountWithoutClaims).toHaveLength(0);
  }

  @test
  @timeout(AbstractTestBase.timeOut)
  async FailApiClaimGetAccountTest(): Promise<void> {
    await this.withRestClient().testQueries.getWithoutOauthTokenTest(this.externalClaimReference);
  }

  @test
  @timeout(AbstractTestBase.timeOut)
  async FailAuthorizedAccessTest(): Promise<void> {
    await this.withRestClient().testQueries.getAccountDataWithDifferentAccountID(this.otherClientId, this.externalClaimReference);
  }

  @test
  @timeout(AbstractTestBase.timeOut)
  async eventsValidationTest(): Promise<void> {
    const events = new Map<string, EventList>();

    for (const eventName of Object.keys(Events)) {
      const eventList = await this.withRestClient().eventsQueries.getEvents(eventName);
      if (eventList === undefined) continue;
      events.set(eventName, eventList);
    }

    console.log(events.keys());
  }

  @test
  @timeout(AbstractTestBase.timeOut)
  async EventsTest(): Promise<void> {
    const queryFilters: QueryFilters = {
      batchSize: 3,
      messageTypes: ["event.claim.created"],
      messageContainsStrings: [this.externalClaimReference],
    };

    const generator = await this.withRestClient().eventsQueries.getMessages(this.clientId, queryFilters);
    let counter = 0;
    for await (const _message of generator) {
      counter++;
    }

    expect(counter).toBe(1);
  }

  @test
  @timeout(AbstractTestBase.timeOut)
  async fetchViewData(): Promise<void> {
    const claimData = await fetchClaimData({
      clientId: "3d132b18-6b6f-4f7c-b464-6a8ee7ca5235",
      externalClaimRef: "ALLAVIN_ACCOUNT_21894-Invoice_21894",
    });

    console.log(claimData);
  }
}

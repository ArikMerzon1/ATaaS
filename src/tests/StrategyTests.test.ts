import { suite, test, timeout } from "@testdeck/jest";
import assert from "assert";
import { v4 as uuidV4 } from "uuid";
import { QueryFilters } from "../eventHelper/EventEmitter";
import { StrategyBuilderPageObject } from "../pageObjects/strategy/StrategyBuilderPageObject";
import { SidebarMenuEnum, StrategyActions, StrategySubMenu } from "../utils/Enums";
import helpers from "../utils/helpers";
import AbstractTestBase from "./AbstractTestBase";

@suite("strategytests")
class StrategyTests extends AbstractTestBase {
  readonly clientId: string;
  readonly externalClaimReference: string;
  readonly otherClientId: string;

  public constructor() {
    super();

    this.clientId = process.env.TEST_CLIENT_ID || "3d132b18-6b6f-4f7c-b464-6a8ee7ca5235";
    this.externalClaimReference = uuidV4();
    this.otherClientId = "be6c5d69-365e-42ad-94d3-052ada3a2aaa";
  }

  @test("createNewStrategy")
  @timeout(AbstractTestBase.timeOut)
  async strategyMissingStepData(): Promise<void> {
    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login();

    const strategyBuilder: StrategyBuilderPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.STRATEGY)
    ).SelectFromSubMenu(StrategySubMenu.STRATEGY_BUILDER);

    await strategyBuilder.strategyCreator(true);

    const strategyName = `testStrategy_${Math.floor(Math.random() * 10000000 + 1)}`;
    console.log(`Strategy name: ${strategyName}`);
    const strategyEditor = await strategyBuilder.createStrategy(strategyName);

    await strategyEditor.SearchForAction(StrategyActions.EMAIL).then((_) => _.DrugAndDropObjects());

    await strategyEditor.SaveStrategy();
    const errorMsg = await strategyEditor.getErrorMsg();

    assert.strictEqual(errorMsg.toLowerCase(), "cannot save");
  }

  /**
   * Before runnning this test,
   * create a strategy
   * configure strategy builder to branch to your strategy based on the meta data set to TEST_STRATEGY_PATH_META
   * Strategy must contain SendEmail and SendClientEmail step (Base on the event types listend to on queryFilters.messageTypes )
   * SendEmail step must have a fail trigger (Add a email design with invalid meta data on the template)
   */

  @test("StrategyAsyncExecution")
  @timeout(AbstractTestBase.timeOut)
  async strategyAsyncExecution(): Promise<void> {
    const TEST_STRATEGY_PATH_META = process.env.TEST_STRATEGY_PATH_META as string;

    if (!TEST_STRATEGY_PATH_META) {
      console.error("Must add meta for strategy path set to TEST_STRATEGY_PATH_META");
      return;
    }

    const { claimListItem } = await this.withRestClient().claimQueries.createClaim({
      meta: {
        [TEST_STRATEGY_PATH_META]: true,
      },
    });

    // retry every 1 minute with maximum try of 3
    // this allows elactic search time to retrive the event messages required for the check
    const RETRY_OPTIONS = { maxTries: 3, delay: 60 * 1000 };

    const isAsyncStrategy = await helpers.retrier(async () => this.isAsyncStrategy(claimListItem.externalClaimRef), {
      ...RETRY_OPTIONS,
      checkFn: Boolean,
    });

    expect(isAsyncStrategy).toBe(true);
  }

  private async isAsyncStrategy(claimRef: string): Promise<boolean> {
    const queryFilters: QueryFilters = {
      batchSize: 300,
      messageTypes: ["event.claim.created", "event.strategyStepSendClientEmail.started", "event.strategyStepSendEmail.started"],
      messageContainsStrings: [claimRef],
    };

    const generator = await this.withRestClient().eventsQueries.getMessages(this.clientId, queryFilters);
    const messageTypesFound = new Set<string>();

    for await (const _message of generator) {
      _message.forEach((message) => {
        messageTypesFound.add(message.attributes.messageType);
      });
    }

    const messages: string[] = Array.from(messageTypesFound);

    console.log("messages found", claimRef, messages, queryFilters.messageTypes);

    return queryFilters.messageTypes.every((item1) => messages.includes(item1));
  }
}

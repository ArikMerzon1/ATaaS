import "reflect-metadata";
import { uuid } from "uuidv4";
import { suite, test, timeout } from "@testdeck/jest";
import { By } from "selenium-webdriver";
import assert from "assert";
import { container } from "tsyringe";
import { ClaimDTO } from "@receeve-gmbh/account-api/ClaimDTO";
import { AccountsSubMenu, ConfigurationSubMenu, SidebarMenuEnum, StrategyActions, StrategySubMenu, TimePeriod, UserRoleBackoffice } from "../utils/Enums";
import { ClaimOverviewPageObject } from "../pageObjects/insights/ClaimOverviewPageObject";
import AbstractTestBase from "./AbstractTestBase";
import { StrategyBuilderPageObject } from "../pageObjects/strategy/StrategyBuilderPageObject";
import AccountOverviewPageObject from "../pageObjects/accounts/AccountsOverviewPageObject";
import RoleManagementViewPo from "../pageObjects/configuration/RoleManagementViewPo";
import DataBaseQueries from "../restClientQueries/DataBaseQueries";
import AccountTaskPageObject from "../pageObjects/accounts/AccountTaskPageObject";
import Helpers from "../utils/helpers";

@suite("uitests")
class UITests extends AbstractTestBase {
  @test("backofficeLoginWithInvalidCredentials")
  @timeout(AbstractTestBase.timeOut)
  async backofficeLoginWithInvalidCredentials(): Promise<void> {
    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login("INVALID_USER@receeve.com");

    await expect(backoffice.LoginPage().errorMsg).toContain("Invalid credentials");
  }

  @test("smoketest")
  @timeout(AbstractTestBase.timeOut)
  async smokeTest(): Promise<void> {
    const { accountId, claimListItem, name } = await this.withRestClient().claimQueries.createClaim();

    console.log(`new accountID: ${accountId}`);
    console.log(`new claimID: ${claimListItem.externalClaimRef}`);

    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login();

    const claimOverview: ClaimOverviewPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.ACCOUNT)
    ).SelectFromSubMenu(AccountsSubMenu.CLAIM_OVERVIEW);
    const claim = await (await claimOverview.SearchClaim(claimListItem.externalClaimRef)).SelectFirstClaim();

    const name2 = await claim.GetDebtorFirstName();

    try {
      assert.strictEqual(name, name2, "Name from API VS Name from Claim");
    } catch (exceptionCapture) {
      await UITests.webDriver.executeScript("lambda-exceptions", exceptionCapture);
    }

    assert.strictEqual(name, name2, "Name from API VS Name from Claim");
  }

  @test("landingpagetest")
  @timeout(AbstractTestBase.timeOut)
  async landingPageTest(): Promise<void> {
    const { accountId, claimListItem, name } = await this.withRestClient().claimQueries.createClaim();
    console.log(`new accountID: ${accountId}`);
    console.log(`new claimID: ${claimListItem.externalClaimRef}`);

    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login();
    const claimOverview: ClaimOverviewPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.ACCOUNT)
    ).SelectFromSubMenu(AccountsSubMenu.CLAIM_OVERVIEW);
    const claim = await (await claimOverview.SearchClaim(claimListItem.externalClaimRef)).SelectFirstClaim();
    await Helpers.takeScreenshot("debtorName");
    console.log(`debtor first name: ${await claim.GetDebtorFirstName()}`);
    const landingPage = await claim.OpenLandingPage();
    await landingPage.setUserName(name).then((loginPage) => loginPage.pressOnContinueButton());
    await landingPage.assertLandingPage();
    await backoffice.GoToMainTab();
  }

  @test("claimcreateupdatetest")
  @timeout(AbstractTestBase.timeOut)
  async claimCreateUpdateTest(): Promise<void> {
    const { accountId, claimListItem } = await this.withRestClient().claimQueries.createClaim();
    const amountApi = claimListItem.totalAmount / 100;
    console.log(`new accountID: ${accountId}`);

    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      const accountOverview: AccountOverviewPageObject = await (
        await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.ACCOUNT)
      ).SelectFromSubMenu(AccountsSubMenu.ACCOUNT_MANAGEMENT);
      const account = await (await accountOverview.SearchAccount(accountId)).SelectFirstAccount();
      await Helpers.sleep(1);
      let amountUi = await account.GetUnpaidAmount();

      console.log(`amount from Api: ${amountApi}`);
      console.log(`amount from UI: ${amountUi}`);
      await expect(amountUi).toBe(amountApi);

      const reduceBy = 30;

      const body = {
        property1: {
          amount: claimListItem.amount - reduceBy * 100, // 5050 - 3000
        },
      };
      await this.withRestClient().claimQueries.updateClaim(claimListItem.externalClaimRef, JSON.stringify(body));
      await backoffice.ReloadPage();

      await Helpers.sleep(1);
      amountUi = await account.GetUnpaidAmount();
      console.log(`amount from Api: ${amountApi - reduceBy}`);
      console.log(`amount from UI: ${amountUi}`);
      await expect(amountUi).toBe(amountApi - reduceBy);
    });
  }

  @test
  @timeout(AbstractTestBase.timeOut)
  async strategyBuilderTest(): Promise<void> {
    await this.withWebDriver().then(async (backOffice) => {
      await backOffice.LoginPage().Login();

      const strategySelector: StrategyBuilderPageObject = await backOffice
        .SidebarMenu()
        .SelectTab(SidebarMenuEnum.STRATEGY)
        .then((result) => result.SelectFromSubMenu(StrategySubMenu.STRATEGY_BUILDER));

      const strategyName = this.generateStrategyName("testStrategy_");
      console.log(`Strategy name: ${strategyName}`);
      const strategyEditor = await strategySelector.createStrategy(strategyName);

      const actionPropEmail = await strategyEditor
        .SearchForAction(StrategyActions.EMAIL)
        .then((_) => _.DrugAndDropObjects())
        .then((_) => _.OpenProperties(StrategyActions.EMAIL, "node-2"));
      await (await actionPropEmail.SetProperties(["AdamMail", "english"])).Continue();

      await strategyEditor
        .SearchForAction(StrategyActions.ENABLE_CALLBACK)
        .then((_) => _.DrugAndDropObjects())
        .then((_) => _.OpenProperties(StrategyActions.ENABLE_CALLBACK, "node-3"))
        .then((_) => _.SetDescription("test_description"))
        .then((_) => _.Continue());

      await strategyEditor
        .SearchForAction(StrategyActions.SMS)
        .then((_) => _.DrugAndDropObjects())
        .then((_) => _.OpenProperties(StrategyActions.SMS, "node-4"))
        .then((_) => _.SetProperties(["crvSms", "english"]))
        .then((_) => _.Continue());

      await Helpers.sleep(1);

      await (await strategyEditor.SaveStrategy()).BackToStrategyBuilder();

      const strategyCard = await strategySelector.searchStrategyCardByName(strategyName);
      await strategyCard.Rename(`${strategyName}_new`);

      await strategySelector.searchAndSelectForStrategyByName(`${strategyName}_new`);
    });
    await Helpers.takeScreenshot("StrategyBuilderTest");
  }

  @test("StrategyBuilderTest-IfCondition-IsHolidayInCountry")
  @timeout(AbstractTestBase.timeOut)
  async strategyBuilderWithIfConditionTest(): Promise<void> {
    const backOffice = await this.withWebDriver();
    await backOffice.LoginPage().Login();

    const sidebar = await backOffice.SidebarMenu().SelectTab(SidebarMenuEnum.STRATEGY);
    const strategySelector: StrategyBuilderPageObject = await sidebar.SelectFromSubMenu(StrategySubMenu.STRATEGY_BUILDER);

    // ----------------
    // save strategy step (if condition), to check if today is holiday in Germany
    // ----------------
    const strategyName = this.generateStrategyName("testStrategy_");
    const strategyEditor = await strategySelector.createStrategy(strategyName);

    await strategyEditor.SearchForAction(StrategyActions.EVALUATE_IF_CONDITION_IS_HOLIDAY);
    await strategyEditor.DrugAndDropObjects();
    await Helpers.sleep(3);
    const strategyStepEditor = await strategyEditor.OpenProperties(StrategyActions.EVALUATE_IF_CONDITION_IS_HOLIDAY, "node-2");
    await strategyStepEditor.SetProperties(["is Holiday", "equals", "de"]);
    await strategyStepEditor.Continue();

    await strategyEditor.SaveStrategy();
    await strategyEditor.BackToStrategyBuilder();

    await strategySelector.searchAndSelectForStrategyByName(strategyName);

    // ----------------
    // verify that the strategy step saved above, is displayed with same properties as saved
    // ----------------
    await strategyEditor.OpenProperties(StrategyActions.EVALUATE_IF_CONDITION_IS_HOLIDAY, "node-2");
    const { selectedVariable, selectedOperation, selectedValue } = await strategyEditor.GetIfConditionValues(By.css('[operation="IS_HOLIDAY_IN_COUNTRY"]'));

    expect(selectedVariable).toEqual("Is holiday");
    expect(selectedOperation).toEqual("Equals");
    expect(selectedValue).toEqual("DE");

    await Helpers.takeScreenshot("StrategyBuilderTest-IfCondition-IsHolidayInCountry");
  }

  @test("StrategyBuilderTest-Step-SendMessage")
  @timeout(AbstractTestBase.timeOut)
  async strategyBuilderStepSendMessage(): Promise<void> {
    const backOffice = await this.withWebDriver();
    await backOffice.LoginPage().Login();

    const sidebar = await backOffice.SidebarMenu().SelectTab(SidebarMenuEnum.STRATEGY);
    const strategySelector: StrategyBuilderPageObject = await sidebar.SelectFromSubMenu(StrategySubMenu.STRATEGY_BUILDER);

    // ----------------
    // save strategy step (send message), to send messages over WhatsApp
    // ----------------
    const messagingApp = "WhatsApp";
    const template = "whatsapp_template";
    const locale = "English (UK)";

    const strategyName = this.generateStrategyName("testStrategy_");
    const strategyEditor = await strategySelector.createStrategy(strategyName);

    await strategyEditor.SearchForAction(StrategyActions.MESSAGE);
    await strategyEditor.DrugAndDropObjects();
    await Helpers.sleep(3);

    const strategyStepEditor = await strategyEditor.OpenProperties(StrategyActions.MESSAGE, "node-2");
    await strategyStepEditor.SetProperties([template, locale]);
    await strategyStepEditor.Continue();

    await strategyEditor.SaveStrategy();
    await strategyEditor.BackToStrategyBuilder();

    await strategySelector.searchAndSelectForStrategyByName(strategyName);

    // ----------------
    // verify that the strategy step saved above, is displayed with same properties as saved
    // ----------------
    await strategyEditor.OpenProperties(StrategyActions.MESSAGE, "node-2");
    const result = await strategyEditor.GetSendMessageValues();

    await Helpers.takeScreenshot("StrategyBuilderTest-Step-SendMessage");

    expect(result.messagingApp).toEqual(messagingApp);
    expect(result.template).toEqual(template);
    expect(result.locale).toEqual(locale);

    await strategyEditor.BackToStrategyBuilder();

    await Helpers.sleep(3);
  }

  @timeout(AbstractTestBase.timeOut)
  async strategyBuilderTest2(): Promise<void> {
    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      const strategySelector: StrategyBuilderPageObject = await backoffice
        .SidebarMenu()
        .SelectTab(SidebarMenuEnum.STRATEGY)
        .then((result) => result.SelectFromSubMenu(StrategySubMenu.STRATEGY_BUILDER));

      const strategyEditor = await strategySelector.createStrategy("testStrategy_12");

      const actionPropEmail = await strategyEditor
        .SearchForAction(StrategyActions.EMAIL)
        .then((_) => _.DrugAndDropObjects())
        .then((_) => _.OpenProperties(StrategyActions.EMAIL, "node-2"));
      await (await actionPropEmail.SetProperties(["AdamMail", "english"])).Continue();

      const actionProp = await strategyEditor
        .SearchForAction(StrategyActions.FINANCIAL_ASSESSMENT)
        .then((_) => _.DrugAndDropObjects())
        .then((_) => _.OpenProperties(StrategyActions.FINANCIAL_ASSESSMENT, "node-3"));

      await actionProp.SetProperties(["email", "adammail", "form 1"]).then((_) => _.Continue());

      const action = await strategyEditor
        .SearchForAction(StrategyActions.ADD_ACCOUNT_TO_CALL_LIST)
        .then((_) => _.DrugAndDropObjects())
        .then((_) => _.OpenProperties(StrategyActions.ADD_ACCOUNT_TO_CALL_LIST, "node-2"));
      await (await action.SetProperties(["Alla 1"])).Continue();

      const action2 = await strategyEditor
        .SearchForAction(StrategyActions.REMOVE_ACCOUNT_TO_CALL_LIST)
        .then((_) => _.DrugAndDropObjects())
        .then((_) => _.OpenProperties(StrategyActions.REMOVE_ACCOUNT_TO_CALL_LIST, "node-3"));
      await (await action2.SetProperties(["Alla 1"])).Continue();

      // await (await strategyEditor.SaveStrategy()).BackToStrategyBuilder();
      // const strategyCard = await strategySelector.SearchStrategyCardByName("testStrategy_11");
      // await strategyCard.Rename("testStrategy_77");
    });

    await Helpers.takeScreenshot("StrategyBuilderTest");
  }

  @test("userroletest")
  @timeout(AbstractTestBase.doubleTimeOut)
  async userRoleTest(): Promise<void> {
    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      const roleManagementView: RoleManagementViewPo = await backoffice
        .SidebarMenu()
        .SelectTab(SidebarMenuEnum.CONFIGURATION)
        .then((result) => result.SelectFromSubMenu(ConfigurationSubMenu.ROLE_MANAGEMENT));

      const roleManagement = await roleManagementView.selectRole(UserRoleBackoffice.AGENT);
      await roleManagement.getPermissionCards();

      const roles = new Map<string, string[]>([
        ["Dashboard", ["Operational dashboards"]],
        ["Strategy", ["Simulator", "Reactions"]],
        ["Configuration", ["General", "Role management"]],
      ]);
      await roleManagement.setPermissions(roles);

      await backoffice.Logout();
      await backoffice.LoginPage().Login("arik.merzon+agent@receeve.com", "Aa!12345");

      await Helpers.takeScreenshot("prop");
    });
  }

  @timeout(AbstractTestBase.timeOut)
  async scrollTest(): Promise<void> {
    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      await Helpers.sleep(5);

      const elements = await Helpers.getElements(By.css(".filter-trigger__label"));
      await Helpers.scrollToElement(elements[2]);

      await Helpers.sleep(5);
    });
  }

  @test("claimStatusTest")
  @timeout(AbstractTestBase.timeOut)
  async claimStatusTest(): Promise<void> {
    const { claimListItem } = await this.withRestClient().claimQueries.createClaim();

    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      const claimsOverview: ClaimOverviewPageObject = await (
        await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.ACCOUNT)
      ).SelectFromSubMenu(AccountsSubMenu.CLAIM_OVERVIEW);

      const claimPo = await (await claimsOverview.SearchClaim(claimListItem.externalClaimRef)).SelectFirstClaim();
      let claimStatusFromUI = await claimPo.GetClaimStatus();
      console.log(`Claim Status from UI: ${claimStatusFromUI}`);

      let claimStatusFromDB = "";
      const dataBaseQueries = container.resolve(DataBaseQueries);
      for await (const claims of dataBaseQueries.findClaim(claimListItem.clientId, claimListItem.externalClaimRef)) {
        for (const claim of claims) {
          claimStatusFromDB = (claim as ClaimDTO).status as string;
          console.log(`Claim Status from DB: ${claimStatusFromDB}`);
        }
      }
      assert.strictEqual(claimStatusFromDB.toLowerCase(), claimStatusFromUI.toLowerCase(), "Claim Status verification before");

      await this.withRestClient().claimQueries.resolveClaims(claimListItem.externalClaimRef);
      await claimPo.webDriver.navigate().refresh();
      for await (const claims of dataBaseQueries.findClaim(claimListItem.clientId, claimListItem.externalClaimRef)) {
        for (const claim of claims) {
          claimStatusFromDB = (claim as ClaimDTO).status as string;
          console.log(`Claim Status from DB: ${claimStatusFromDB}`);
        }
      }
      claimStatusFromUI = await claimPo.GetClaimStatus();
      console.log(`Claim Status from UI: ${claimStatusFromUI}`);

      assert.strictEqual(claimStatusFromDB.toLowerCase(), "resolved", "DB Claim Status verification after");
      assert.strictEqual(claimStatusFromUI.toLowerCase(), "not active", "UI Claim Status verification after");
    });
  }

  private generateStrategyName(prefix: string): string {
    return `${prefix}${uuid()}`;
  }

  @test("tasktest")
  @timeout(AbstractTestBase.timeOut)
  async taskTest(): Promise<void> {
    // const { accountId, claimId, name } = await this.withRestClient().claimQueries.createClaim();

    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login();

    const tasksPage: AccountTaskPageObject = await (await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.ACCOUNT)).SelectFromSubMenu(AccountsSubMenu.TASKS);

    await tasksPage.selectTimePeriod(TimePeriod.NO_DUE_DATE);

    await Helpers.sleep(5);

    await Helpers.takeScreenshot("tasks");

    // const claim = await (await claimOverview.SearchClaim(claimId)).SelectFirstClaim();
    // const name2 = await claim.GetDebtorFirstName();
    //
    // try {
    //   assert.strictEqual(name, name2, "Name from API VS Name from Claim");
    // } catch (exceptionCapture) {
    //   await UITests.webDriver.executeScript("lambda-exceptions", exceptionCapture);
    // }
    //
    // assert.strictEqual(name, name2, "Name from API VS Name from Claim");
  }
}

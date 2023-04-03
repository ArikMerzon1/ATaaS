import "reflect-metadata";
import { suite, test, timeout } from "@testdeck/jest";
import { By } from "selenium-webdriver";
import assert from "assert";
import { container } from "tsyringe";
import { ClaimDTO } from "@exness/account-api/ClaimDTO";
import { AccountsSubMenu, ConfigurationSubMenu, SidebarMenuEnum, StrategyActions, StrategySubMenu, UserRoleBackoffice } from "../utils/Enums";
import { ClaimOverviewPageObject } from "../pageObjects/insights/ClaimOverviewPageObject";
import AbstractTestBase from "./AbstractTestBase";
import helpers from "../utils/helpers";
import { StrategyBuilderPageObject } from "../pageObjects/strategy/StrategyBuilderPageObject";
import AccountOverviewPageObject from "../pageObjects/accounts/AccountsOverviewPageObject";
import RoleManagementViewPo from "../pageObjects/configuration/RoleManagementViewPo";
import DataBaseQueries from "../restClientQueries/DataBaseQueries";

@suite("uitests")
class UITests extends AbstractTestBase {
  @test("backofficeLoginWithInvalidCredentials")
  @timeout(AbstractTestBase.timeOut)
  async backofficeLoginWithInvalidCredentials(): Promise<void> {
    const backoffice = await this.withWebDriver();
    const errorMessage = await backoffice.LoginPage().LoginWithInvalidUserName("INVALID_USER@exness.com");

    await expect(errorMessage).toContain("User does not exist.");

    await helpers.takeScreenshot("listView");
  }

  @test("smoketest")
  @timeout(AbstractTestBase.timeOut)
  async smokeTest(): Promise<void> {
    const result = await this.withRestClient().claimQueries.createClaim();
    const accountId = result.data.accountReference as string;
    const claimID = result.messages[0].split(" ").pop() || "";
    const name1 = result.data.primaryDebtor.firstName;
    console.log(`new accountID: ${accountId}`);
    console.log(`new claimID: ${claimID}`);

    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login();

    const claimOverview: ClaimOverviewPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.ACCOUNT)
    ).SelectFromSubMenu(AccountsSubMenu.claimOverview);
    const claim = await (await claimOverview.SearchClaim(claimID)).SelectFirstClaim();

    const name2 = await claim.GetDebtorFirstName();

    try {
      assert.strictEqual(name1, name2, "Name from API VS Name from Claim");
    } catch (exceptionCapture) {
      await UITests.webDriver.executeScript("lambda-exceptions", exceptionCapture);
    }

    assert.strictEqual(name1, name2, "Name from API VS Name from Claim");
  }

  @test("landingpagetest")
  @timeout(AbstractTestBase.timeOut)
  async landingPageTest(): Promise<void> {
    const backoffice = await this.withWebDriver();
    const result = await this.withRestClient().claimQueries.createClaim();
    const accountId = result.data.accountReference as string;
    const claimID = result.messages[0].split(" ").pop() || "";
    const debtorName = result.data.primaryDebtor.firstName || "";
    console.log(`new accountID: ${accountId}`);
    console.log(`new claimID: ${claimID}`);

    await backoffice.LoginPage().Login();
    const claimOverview: ClaimOverviewPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.ACCOUNT)
    ).SelectFromSubMenu(AccountsSubMenu.claimOverview);
    const claim = await (await claimOverview.SearchClaim(claimID)).SelectFirstClaim();
    await helpers.takeScreenshot("debtorName");
    console.log(`debtor first name: ${await claim.GetDebtorFirstName()}`);
    const landingPage = await claim.OpenLandingPage();
    await landingPage.setUserName(debtorName).then((loginPage) => loginPage.pressOnContinueButton());
    await landingPage.assertLandingPage();
    await backoffice.GoToMainTab();
  }

  @test("claimcreateupdatetest")
  @timeout(AbstractTestBase.timeOut)
  async claimCreateUpdateTest(): Promise<void> {
    const result = await this.withRestClient().claimQueries.createClaim();
    const accountId = result.data.accountReference as string;
    console.log(`new accountID: ${accountId}`);
    const amountApi = (result.data.amount + result.data.totalFees) / 100;

    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      const accountOverview: AccountOverviewPageObject = await (
        await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.ACCOUNT)
      ).SelectFromSubMenu(AccountsSubMenu.accountManagement);
      const account = await (await accountOverview.SearchAccount(accountId)).SelectFirstAccount();
      await helpers.sleep(1);
      let amountUi = await account.GetUnpaidAmount();
      await expect(amountUi).toBe(amountApi);

      const claimId = result.messages[0].split(" ")[3];
      const body = {
        property1: {
          amount: (result.data.amount - 30) * 100,
        },
      };
      await this.withRestClient().claimQueries.updateClaim(claimId, JSON.stringify(body));
      await backoffice.ReloadPage();

      await helpers.sleep(1);
      amountUi = await account.GetUnpaidAmount();
      await expect(amountUi).toBe(amountApi - 30);
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

      const strategyName = `testStrategy_${Math.floor(Math.random() * 10000000 + 1)}`;
      console.log(`Strategy name: ${strategyName}`);
      const strategyEditor = await strategySelector.CreateStrategy(strategyName);

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

      await helpers.sleep(1);

      await (await strategyEditor.SaveStrategy()).BackToStrategyBuilder();

      const strategyCard = await strategySelector.SearchStrategyCardByName(strategyName);
      await strategyCard.Rename(`${strategyName}_new`);

      await strategySelector.SearchAndSelectForStrategyByName(`${strategyName}_new`);
    });
    await helpers.takeScreenshot("StrategyBuilderTest");
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
    const strategyName = `testStrategy_${Math.floor(Math.random() * 10000000 + 1)}`;
    const strategyEditor = await strategySelector.CreateStrategy(strategyName);

    await strategyEditor.SearchForAction(StrategyActions.EVALUATE_IF_CONDITION_IS_HOLIDAY);
    await strategyEditor.DrugAndDropObjects();
    await helpers.sleep(3);
    const strategyStepEditor = await strategyEditor.OpenProperties(StrategyActions.EVALUATE_IF_CONDITION_IS_HOLIDAY, "node-2");
    await strategyStepEditor.SetProperties(["is Holiday", "equals", "de"]);
    await strategyStepEditor.Continue();

    await strategyEditor.SaveStrategy();
    await strategyEditor.BackToStrategyBuilder();

    await strategySelector.SearchAndSelectForStrategyByName(strategyName);

    // ----------------
    // verify that the strategy step saved above, is displayed with same properties as saved
    // ----------------
    await strategyEditor.OpenProperties(StrategyActions.EVALUATE_IF_CONDITION_IS_HOLIDAY, "node-2");
    const { selectedVariable, selectedOperation, selectedValue } = await strategyEditor.GetIfConditionValues(By.css('[operation="IS_HOLIDAY_IN_COUNTRY"]'));

    expect(selectedVariable).toEqual("Is holiday");
    expect(selectedOperation).toEqual("Equals");
    expect(selectedValue).toEqual("DE");

    await helpers.takeScreenshot("StrategyBuilderTest-IfCondition-IsHolidayInCountry");
  }

  @timeout(AbstractTestBase.timeOut)
  async strategyBuilderTest2(): Promise<void> {
    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      const strategySelector: StrategyBuilderPageObject = await backoffice
        .SidebarMenu()
        .SelectTab(SidebarMenuEnum.STRATEGY)
        .then((result) => result.SelectFromSubMenu(StrategySubMenu.STRATEGY_BUILDER));

      const strategyEditor = await strategySelector.CreateStrategy("testStrategy_12");

      // const actionPropEmail = await strategyEditor
      //   .SearchForAction(StrategyActions.EMAIL)
      //   .then((_) => _.DrugAndDropObjects())
      //   .then((_) => _.OpenProperties(StrategyActions.EMAIL, "node-2"));
      // await (await actionPropEmail.SetProperties(["AdamMail", "english"])).Continue();
      //
      // const actionProp = await strategyEditor
      //   .SearchForAction(StrategyActions.FINANCIAL_ASSESSMENT)
      //   .then((_) => _.DrugAndDropObjects())
      //   .then((_) => _.OpenProperties(StrategyActions.FINANCIAL_ASSESSMENT, "node-3"));
      //
      // await actionProp.SetProperties(["email", "adammail", "form 1"]).then((_) => _.Continue());

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

    await helpers.takeScreenshot("StrategyBuilderTest");
  }

  @test("userroletest")
  @timeout(AbstractTestBase.timeOut)
  async userRoleTest(): Promise<void> {
    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      const roleManagementView: RoleManagementViewPo = await backoffice
        .SidebarMenu()
        .SelectTab(SidebarMenuEnum.CONFIGURATION)
        .then((result) => result.SelectFromSubMenu(ConfigurationSubMenu.roleManagement));

      const roleManagement = await roleManagementView.selectRole(UserRoleBackoffice.AGENT);
      await roleManagement.getPermissionCards();

      const roles = new Map<string, string[]>([
        ["Dashboard", ["Operational dashboards"]],
        ["Strategy", ["Simulator", "Reactions"]],
        ["Configuration", ["General", "Role management"]],
      ]);
      await roleManagement.setPermissions(roles);

      await backoffice.Logout();
      await backoffice.LoginPage().Login("arik.merzon+agent@exness.com", "Aa!12345");

      await helpers.takeScreenshot("prop");
    });
  }

  @test
  @timeout(AbstractTestBase.timeOut)
  async scrollTest(): Promise<void> {
    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      await helpers.sleep(5);

      const elements = await helpers.getElements(By.css(".filter-trigger__label"));
      await helpers.scrollToElement(elements[2]);

      await helpers.sleep(5);
    });
  }

  @test("claimStatusTest")
  @timeout(AbstractTestBase.timeOut)
  async claimStatusTest(): Promise<void> {
    const claimResult = await this.withRestClient().claimQueries.createClaim();
    const claimRef = claimResult.messages[0].split(" ").splice(-1)[0];

    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      const claimsOverview: ClaimOverviewPageObject = await (
        await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.ACCOUNT)
      ).SelectFromSubMenu(AccountsSubMenu.claimOverview);

      const claimPo = await (await claimsOverview.SearchClaim(claimRef)).SelectFirstClaim();
      let claimStatusFromUI = await claimPo.GetClaimStatus();
      console.log(`Claim Status from UI: ${claimStatusFromUI}`);

      let claimStatusFromDB = "";
      const dataBaseQueries = container.resolve(DataBaseQueries);
      for await (const claims of dataBaseQueries.findClaim(process.env.TEST_CLIENT_ID as string, claimRef)) {
        for (const claim of claims) {
          claimStatusFromDB = (claim as ClaimDTO).status as string;
          console.log(`Claim Status from DB: ${claimStatusFromDB}`);
        }
      }
      assert.strictEqual(claimStatusFromDB.toLowerCase(), claimStatusFromUI.toLowerCase(), "Claim Status verification before");

      await this.withRestClient().claimQueries.resolveClaims(claimRef);
      await claimPo.webDriver.navigate().refresh();
      for await (const claims of dataBaseQueries.findClaim(process.env.TEST_CLIENT_ID as string, claimRef)) {
        for (const claim of claims) {
          claimStatusFromDB = (claim as ClaimDTO).status as string;
          console.log(`Claim Status from DB: ${claimStatusFromDB}`);
        }
      }
      claimStatusFromUI = await claimPo.GetClaimStatus();
      console.log(`Claim Status from UI: ${claimStatusFromUI}`);

      assert.strictEqual(claimStatusFromDB.toLowerCase(), "expected", "Claim Status verification after");
      assert.strictEqual(claimStatusFromUI.toLowerCase(), "resolved", "Claim Status verification after");
    });
  }
}

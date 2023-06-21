import { suite, test, timeout } from "@testdeck/jest";
import { uuid } from "uuidv4";
import AbstractTestBase from "./AbstractTestBase";
import { SidebarMenuEnum, StrategySubMenu } from "../utils/Enums";
import helpers from "../utils/helpers";
import { StrategyBuilderPageObject } from "../pageObjects/strategy/StrategyBuilderPageObject";
import { Backoffice } from "../pageObjects/mainPageObjects/Backoffice";

@suite("uitests")
class StrategyBuilderTest extends AbstractTestBase {
  @test("strategyBuilderTest:Create")
  @timeout(AbstractTestBase.timeOut)
  async createStrategy(): Promise<void> {
    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      const strategySelector = await this.selectStrategyBuilderPage(backoffice);
      const strategyName = this.generateStrategyName("testStrategy_");

      // Add new Strategy to the list and filter by name
      await strategySelector.createStrategyWithStep(strategyName);

      // Verify that strategy has been saved
      const strategyCard = await strategySelector.searchStrategyCardByName(strategyName);

      // Cleanup
      await strategyCard.EnableActionDropdown();
      await strategyCard.Delete();
    });

    await helpers.takeScreenshot("StrategyBuilderTest:Create");
  }

  @test("strategyBuilderTest:Clone")
  @timeout(AbstractTestBase.timeOut)
  async cloneStrategy(): Promise<void> {
    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      const strategySelector = await this.selectStrategyBuilderPage(backoffice);
      const strategyName = this.generateStrategyName("testStrategyClone_");

      // Add new Strategy to the list and filter by name
      await strategySelector.createStrategyWithStep(strategyName);
      const strategyCard = await strategySelector.searchStrategyCardByName(strategyName);
      await strategyCard.EnableActionDropdown();

      // Clone existing strategy
      const strategyEditor = await strategyCard.Clone(this.generateStrategyName(`Copy_of_${strategyName}`));
      await (await strategyEditor.SaveStrategy()).BackToStrategyBuilder();

      // Verify that both strategies have been saved
      await strategySelector.searchStrategyCardByName(strategyName);

      // Cleanup
      await strategyCard.EnableActionDropdown();
      await strategyCard.Delete();
    });

    await helpers.takeScreenshot("StrategyBuilderTest:Clone");
  }

  @test("strategyBuilderTest:Rename")
  @timeout(AbstractTestBase.timeOut)
  async renameStrategy(): Promise<void> {
    await this.withWebDriver().then(async (backoffice) => {
      await backoffice.LoginPage().Login();

      const strategySelector = await this.selectStrategyBuilderPage(backoffice);
      const strategyName = this.generateStrategyName("testStrategyRename_");

      // Add new Strategy to the list and filter by name
      await strategySelector.createStrategyWithStep(strategyName);
      const strategyCard = await strategySelector.searchStrategyCardByName(strategyName);
      await strategyCard.EnableActionDropdown();

      // Rename existing strategy
      const newStrategyName = this.generateStrategyName(`Renamed_${strategyName}`);
      await strategyCard.Rename(newStrategyName);

      // Cleanup
      await strategyCard.EnableActionDropdown();
      await strategyCard.Delete();
    });

    await helpers.takeScreenshot("StrategyBuilderTest:Rename");
  }

  private async selectStrategyBuilderPage(backoffice: Backoffice): Promise<StrategyBuilderPageObject> {
    return backoffice
      .SidebarMenu()
      .SelectTab(SidebarMenuEnum.STRATEGY)
      .then((result) => result.SelectFromSubMenu(StrategySubMenu.STRATEGY_BUILDER));
  }

  private generateStrategyName(prefix: string): string {
    return `${prefix}${uuid()}`;
  }

  @test("StrategyBuilderTest-assign-Categories")
  @timeout(AbstractTestBase.timeOut)
  async strategyBuilderAssignCategories(): Promise<void> {
    const backOffice = await this.withWebDriver();
    await backOffice.LoginPage().Login();

    const sidebar = await backOffice.SidebarMenu().SelectTab(SidebarMenuEnum.STRATEGY);
    const strategySelector: StrategyBuilderPageObject = await sidebar.SelectFromSubMenu(StrategySubMenu.STRATEGY_BUILDER);
    await strategySelector.assignCategoriesToStrategies();
  }

  @test("StrategyBuilderTest-filter-Categories")
  @timeout(AbstractTestBase.timeOut)
  async strategyBuilderFilterCategories(): Promise<void> {
    const backOffice = await this.withWebDriver();
    await backOffice.LoginPage().Login();

    const sidebar = await backOffice.SidebarMenu().SelectTab(SidebarMenuEnum.STRATEGY);
    const strategySelector: StrategyBuilderPageObject = await sidebar.SelectFromSubMenu(StrategySubMenu.STRATEGY_BUILDER);
    await strategySelector.filterStrategiesByCategory();
  }

  @test("StrategyBuilderTest-assign-Categories-deselectAll")
  @timeout(AbstractTestBase.timeOut)
  async deselectAllStrategies(): Promise<void> {
    const backOffice = await this.withWebDriver();
    await backOffice.LoginPage().Login();

    const sidebar = await backOffice.SidebarMenu().SelectTab(SidebarMenuEnum.STRATEGY);
    const strategySelector: StrategyBuilderPageObject = await sidebar.SelectFromSubMenu(StrategySubMenu.STRATEGY_BUILDER);
    await strategySelector.deselectAllStrategies();
  }

  @test("StrategyBuilderTest-edit-Categories")
  @timeout(AbstractTestBase.timeOut)
  async strategyBuilderEditCategories(): Promise<void> {
    const backOffice = await this.withWebDriver();
    await backOffice.LoginPage().Login();

    const sidebar = await backOffice.SidebarMenu().SelectTab(SidebarMenuEnum.STRATEGY);
    const strategySelector: StrategyBuilderPageObject = await sidebar.SelectFromSubMenu(StrategySubMenu.STRATEGY_BUILDER);

    const strategyName = this.generateStrategyName("testStrategy_");

    // Add new Strategy to the list and filter by name
    await strategySelector.createStrategyWithStep(strategyName);

    await strategySelector.searchAndSelectForStrategyByName(strategyName);

    await strategySelector.editStrategyCategories();

    await helpers.sleep(5);
  }
}

import { suite, test, timeout } from "@testdeck/jest";
import "reflect-metadata";
import { ChartCreatorPageObject } from "../pageObjects/insights/ChartCreatorPageObject";
import { DashboardSubMenu, SidebarMenuEnum } from "../utils/Enums";
import AbstractTestBase from "./AbstractTestBase";

@suite("DashboardChartCreator")
class DashboardChartCreatorTests extends AbstractTestBase {
  @test("DashboardChartCreator:VerifyPivot")
  @timeout(AbstractTestBase.timeOut)
  async verifyPivot(): Promise<void> {
    const backoffice = await this.withWebDriver();

    await backoffice.LoginPage().Login();
    const chartCreator: ChartCreatorPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.DASHBOARD)
    ).SelectFromSubMenu(DashboardSubMenu.CHART_CREATOR);

    await chartCreator
      .CreateTemplate()
      .then((_) =>
        _.SelectFilters({
          type: "line",
          area: "Payment insight",
          measures: ["Attempts"],
          dimensions: ["Claim status", "Payment provider"],
          pivotConfig: { x: ["measures"], y: ["PaymentInsight.claimStatus"] },
        })
      )
      .then((_) => _.GenerateChart());
  }

  @test("DashboardChartCreator:VerifyOrder")
  @timeout(AbstractTestBase.timeOut)
  async verifyOrder(): Promise<void> {
    const backoffice = await this.withWebDriver();

    await backoffice.LoginPage().Login();
    const chartCreator: ChartCreatorPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.DASHBOARD)
    ).SelectFromSubMenu(DashboardSubMenu.CHART_CREATOR);

    await chartCreator
      .CreateTemplate()
      .then((_) =>
        _.SelectFilters({
          type: "line",
          area: "Payment insight",
          measures: ["Attempts"],
          dimensions: ["Claim status", "Payment provider"],
          orderMembers: [
            { id: "PaymentInsight.claimStatus", title: "Payment Insight Status", order: "desc" },
            { id: "PaymentInsight.provider", title: "Payment Insight Provider", order: "desc" },
            { id: "PaymentInsight.attempts", title: "Attempts", order: "asc" },
            { id: "PaymentInsight.emitTime", title: "Happened at", order: "desc" },
          ],
        })
      )
      .then((_) => _.GenerateChart());
  }

  @test("DashboardChartCreator:VerifyLimit")
  @timeout(AbstractTestBase.timeOut)
  async verifyLimit(): Promise<void> {
    const backoffice = await this.withWebDriver();

    await backoffice.LoginPage().Login();
    const chartCreator: ChartCreatorPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.DASHBOARD)
    ).SelectFromSubMenu(DashboardSubMenu.CHART_CREATOR);

    await chartCreator
      .CreateTemplate()
      .then((_) =>
        _.SelectFilters({
          type: "line",
          area: "Payment insight",
          measures: ["Attempts"],
          dimensions: ["Claim status", "Payment provider"],
          limit: 1000,
        })
      )
      .then((_) => _.GenerateChart());
  }
}

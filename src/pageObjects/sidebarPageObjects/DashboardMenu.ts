import { By, ThenableWebDriver } from "selenium-webdriver";
import { container, inject, injectable } from "tsyringe";
import { DashboardSubMenu } from "../../utils/Enums";
import helpers from "../../utils/helpers";
import { ChartCreatorPageObject } from "../insights/ChartCreatorPageObject";
import { CommunicationOverviewPageObject } from "../insights/CommunicationOverviewPageObject";
import { ContentInsightsPageObject } from "../insights/ContentInsightsPageObject";
import { LandingPageInsightsPageObject } from "../insights/LandingPageInsightsPageObject";
import { PaymentInsightsPageObject } from "../insights/PaymentInsightsPageObject";
import { ReportsPageObject } from "../insights/ReportsPageObject";
import { IMenu } from "./IMenu";

@injectable()
export class DashboardMenu implements IMenu {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async SelectFromSubMenu(selection: string): Promise<unknown> {
    let selectedSubMenu: unknown;

    switch (selection) {
      case DashboardSubMenu.COMMUNICATION_OVERVIEW:
        selectedSubMenu = container.resolve(CommunicationOverviewPageObject);
        break;
      case DashboardSubMenu.CONTENT_INSIGHTS:
        selectedSubMenu = container.resolve(ContentInsightsPageObject);
        break;
      case DashboardSubMenu.LANDING_PAGE_INSIGHTS:
        selectedSubMenu = container.resolve(LandingPageInsightsPageObject);
        break;
      case DashboardSubMenu.REPORTS:
        selectedSubMenu = container.resolve(ReportsPageObject);
        break;
      case DashboardSubMenu.PAYMENT_INSIGHTS:
        selectedSubMenu = container.resolve(PaymentInsightsPageObject);
        break;
      case DashboardSubMenu.CHART_CREATOR:
        selectedSubMenu = container.resolve(ChartCreatorPageObject);
        break;
      default:
        throw new Error(`You've picked a menu not from the list please try again: ${selection}`);
    }
    await (await helpers.getElement(By.css(`[data-test-id="${selection}"]`))).click();
    return selectedSubMenu;
  }
}

export default { InsightsMenu: DashboardMenu };

import { container, inject, injectable } from "tsyringe";
import { By, ThenableWebDriver } from "selenium-webdriver";
import { IMenu } from "./IMenu";
import { DashboardSubMenu } from "../../utils/Enums";
import { CommunicationOverviewPageObject } from "../insights/CommunicationOverviewPageObject";
import { ContentInsightsPageObject } from "../insights/ContentInsightsPageObject";
import { LandingPageInsightsPageObject } from "../insights/LandingPageInsightsPageObject";
import { PaymentInsightsPageObject } from "../insights/PaymentInsightsPageObject";
import { ReportsPageObject } from "../insights/ReportsPageObject";
import helpers from "../../utils/helpers";

@injectable()
export class DashboardMenu implements IMenu {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async SelectFromSubMenu(selection: string): Promise<unknown> {
    let selectedSubMenu: unknown;

    switch (selection) {
      case DashboardSubMenu.communicationOverview:
        selectedSubMenu = container.resolve(CommunicationOverviewPageObject);
        break;
      case DashboardSubMenu.contentInsights:
        selectedSubMenu = container.resolve(ContentInsightsPageObject);
        break;
      case DashboardSubMenu.landingPageInsights:
        selectedSubMenu = container.resolve(LandingPageInsightsPageObject);
        break;
      case DashboardSubMenu.reports:
        selectedSubMenu = container.resolve(ReportsPageObject);
        break;
      case DashboardSubMenu.paymentInsights:
        selectedSubMenu = container.resolve(PaymentInsightsPageObject);
        break;
      default:
        throw new Error(`You've picked a menu not from the list please try again: ${selection}`);
    }
    await (await helpers.getElement(By.css(`[data-test-id="${selection}"]`))).click();
    return selectedSubMenu;
  }
}

export default { InsightsMenu: DashboardMenu };

import { ThenableWebDriver } from "selenium-webdriver";
import { inject, injectable } from "tsyringe";
import { ISubMenu } from "../sidebarPageObjects/ISubMenu";

@injectable()
export class LandingPageInsightsPageObject implements ISubMenu {
  constructor(@inject("webDriver") readonly webDriver: ThenableWebDriver) {}
}

export default { LandingPageInsightsPageObject };

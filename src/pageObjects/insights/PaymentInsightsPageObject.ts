import { ThenableWebDriver } from "selenium-webdriver";
import { inject, injectable } from "tsyringe";
import { ISubMenu } from "../sidebarPageObjects/ISubMenu";

@injectable()
export class PaymentInsightsPageObject implements ISubMenu {
  constructor(@inject("webDriver") readonly webDriver: ThenableWebDriver) {}
}
export default { PaymentInsightsPageObject };

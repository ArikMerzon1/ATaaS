import { inject, injectable } from "tsyringe";
import { ThenableWebDriver } from "selenium-webdriver";
import { IMenu } from "./sidebarPageObjects/IMenu";

@injectable()
export class DashboardPageObject implements IMenu {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  SelectFromSubMenu(_selection: string): Promise<unknown> {
    return Promise.resolve(undefined);
  }
}

export default { DashboardPageObject };

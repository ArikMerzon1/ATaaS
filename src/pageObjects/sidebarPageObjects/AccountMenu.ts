import { By, ThenableWebDriver } from "selenium-webdriver";
import { container, inject, injectable } from "tsyringe";
import { IMenu } from "./IMenu";
import { AccountsSubMenu } from "../../utils/Enums";
import helpers from "../../utils/helpers";
import AccountOverviewPageObject from "../accounts/AccountsOverviewPageObject";
import { ClaimOverviewPageObject } from "../insights/ClaimOverviewPageObject";
import AccountTaskPageObject from "../accounts/AccountTaskPageObject";

@injectable()
export class AccountMenu implements IMenu {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async SelectFromSubMenu(selection: string): Promise<unknown> {
    let selectedSubMenu: unknown;

    switch (selection) {
      case AccountsSubMenu.CLAIM_OVERVIEW:
        selectedSubMenu = container.resolve(ClaimOverviewPageObject);
        break;
      case AccountsSubMenu.QUEUES:
        selectedSubMenu = container.resolve(AccountTaskPageObject);
        break;
      case AccountsSubMenu.ACCOUNT_MANAGEMENT:
        selectedSubMenu = container.resolve(AccountOverviewPageObject);
        break;
      default:
        throw new Error(`You've picked a menu not from the list please try again: ${selection}`);
    }
    await (await Promise.resolve(helpers.getElement(By.css(`[data-test-id="${selection}"]`)))).click();
    return selectedSubMenu;
  }
}

export default { AccountMenu };

import { By, ThenableWebDriver } from "selenium-webdriver";
import { container, inject, injectable } from "tsyringe";
import { IMenu } from "./IMenu";
import { ContentSubMenu } from "../../utils/Enums";
import helpers from "../../utils/helpers";
import LandingPageBuilderPageObject from "../content/LandingPageBuilderPageObject";
import EmailBuilderPageObject from "../content/EmailBuilderPageObject";

@injectable()
export class ContentMenu implements IMenu {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async SelectFromSubMenu(selection: string): Promise<unknown> {
    let selectedSubMenu: unknown;

    switch (selection) {
      case ContentSubMenu.LANDING_PAGE_BUILDER:
        selectedSubMenu = container.resolve(LandingPageBuilderPageObject);
        break;
      case ContentSubMenu.EMAIL_BUILDER:
        selectedSubMenu = container.resolve(EmailBuilderPageObject);
        break;
      default:
        throw new Error(`You've picked a menu not from the list please try again: ${selection}`);
    }
    await (await helpers.getElement(By.css(`[data-test-id="${selection}"]`))).click();
    return selectedSubMenu;
  }
}

export default { ContentMenu };

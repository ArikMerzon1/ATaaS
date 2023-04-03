import { By, ThenableWebDriver } from "selenium-webdriver";
import { inject, injectable, container } from "tsyringe";
import { AssetManagerSubMenu } from "../../utils/Enums";
import Helpers from "../../utils/helpers";
import AssetPartnersListPageObject from "../assetManager/AssetPartnersListPageObject";
import { IMenu } from "./IMenu";

@injectable()
export class AssetManagerMenu implements IMenu {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async SelectFromSubMenu(selection: string): Promise<unknown> {
    let selectedSubMenu: unknown;

    switch (selection) {
      case AssetManagerSubMenu.PARTNERS:
        selectedSubMenu = container.resolve(AssetPartnersListPageObject);
        break;

      default:
        throw new Error(`You've picked a menu not from the list please try again: ${selection}`);
    }
    await (await Promise.resolve(Helpers.getElement(By.css(`[data-test-id="${selection}"]`)))).click();
    return selectedSubMenu;
  }
}

export default { AssetManagerMenu };

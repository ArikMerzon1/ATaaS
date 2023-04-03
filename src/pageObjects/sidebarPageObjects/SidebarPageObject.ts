import { By, ThenableWebDriver } from "selenium-webdriver";
import { container, inject, injectable } from "tsyringe";
import { SidebarMenuEnum } from "../../utils/Enums";
import { IMenu } from "./IMenu";
import { StrategyMenu } from "./StrategyMenu";
import { AiPageObject } from "./AiPageObject";
import { ContentMenu } from "./ContentMenu";
import { AssetManagerMenu } from "./AssetManagerMenu";
import { DashboardMenu } from "./DashboardMenu";
import { AccountMenu } from "./AccountMenu";
import { TestPageObject } from "./TestPageObject";
import ConfigurationMenu from "./ConfigurationMenu";
import { ClientSelectionPageObject } from "./ClientSelectionPageObject";
import { NotificationPageObject } from "./NotificationPageObject";
import { HelpPageObject } from "./HelpPageObject";
import helpers from "../../utils/helpers";

@injectable()
export default class SidebarPageObject {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver, @inject(TestPageObject) private readonly testPageObject: TestPageObject) {}

  async SelectTab(selection: SidebarMenuEnum): Promise<IMenu> {
    console.log(`select tab on Sidebar: ${selection}`);
    let selectedMenu: IMenu;

    switch (selection) {
      case SidebarMenuEnum.AI:
        selectedMenu = container.resolve(AiPageObject);
        break;
      case SidebarMenuEnum.STRATEGY:
        selectedMenu = container.resolve(StrategyMenu);
        break;
      case SidebarMenuEnum.CONTENT:
        selectedMenu = container.resolve(ContentMenu);
        break;
      case SidebarMenuEnum.ASSET_MANAGER:
        selectedMenu = container.resolve(AssetManagerMenu);
        break;
      case SidebarMenuEnum.DASHBOARD:
        selectedMenu = container.resolve(DashboardMenu);
        break;
      case SidebarMenuEnum.ACCOUNT:
        selectedMenu = container.resolve(AccountMenu);
        break;
      case SidebarMenuEnum.TEST:
        selectedMenu = container.resolve(TestPageObject);
        break;
      case SidebarMenuEnum.CONFIGURATION:
        selectedMenu = container.resolve(ConfigurationMenu);
        break;
      case SidebarMenuEnum.SELECT_CLIENT:
        selectedMenu = container.resolve(ClientSelectionPageObject);
        break;
      case SidebarMenuEnum.NOTIFICATION:
        selectedMenu = container.resolve(NotificationPageObject);
        break;
      case SidebarMenuEnum.HELP:
        selectedMenu = container.resolve(HelpPageObject);
        break;
      default:
        console.error(`You've picked a menu not from the list please try again: ${selection}`);
        throw new Error(`You've picked a menu not from the list please try again: ${selection}`);
    }

    await (await helpers.getElement(By.css(`[data-test-id="${selection}"]`))).click();

    return selectedMenu;
  }
}

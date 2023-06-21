import { By, ThenableWebDriver } from "selenium-webdriver";
import { container, inject, injectable } from "tsyringe";
import { IMenu } from "./IMenu";
import { ConfigurationSubMenu } from "../../utils/Enums";
import helpers from "../../utils/helpers";
import GeneralConfViewPageObject from "../configuration/GeneralConfViewPageObject";
import OperationsViewPo from "../configuration/OperationsViewPo";
import SchedulesViewPo from "../configuration/SchedulesViewPo";
import QueuesViewPo from "../configuration/QueuesViewPo";
import WorkflowsViewPo from "../configuration/WorkflowsViewPo";
import WebHooksViewPageObject from "../configuration/WebHooksViewPageObject";
import UsersViewPO from "../configuration/UsersViewPO";
import RoleManagementViewPo from "../configuration/RoleManagementViewPo";

@injectable()
export default class ConfigurationMenu implements IMenu {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async SelectFromSubMenu(selection: string): Promise<unknown> {
    console.log(`select menu form the subMenu list: ${selection}`);
    let selectedSubMenu: unknown;

    switch (selection) {
      case ConfigurationSubMenu.GENERAL:
        selectedSubMenu = container.resolve(GeneralConfViewPageObject);
        break;
      case ConfigurationSubMenu.OPERATIONS:
        selectedSubMenu = container.resolve(OperationsViewPo);
        break;
      case ConfigurationSubMenu.SCHEDULES:
        selectedSubMenu = container.resolve(SchedulesViewPo);
        break;
      case ConfigurationSubMenu.USERS:
        selectedSubMenu = container.resolve(UsersViewPO);
        break;
      case ConfigurationSubMenu.WEBHOOKS:
        selectedSubMenu = container.resolve(WebHooksViewPageObject);
        break;
      case ConfigurationSubMenu.QUEUES:
        selectedSubMenu = container.resolve(QueuesViewPo);
        break;
      case ConfigurationSubMenu.WORKFLOW:
        selectedSubMenu = container.resolve(WorkflowsViewPo);
        break;
      case ConfigurationSubMenu.ROLE_MANAGEMENT:
        selectedSubMenu = container.resolve(RoleManagementViewPo);
        break;

      default:
        throw new Error(`You've picked a menu not from the list please try again: ${selection}`);
    }

    await (await helpers.getElement(By.css(`[data-test-id="${selection}"]`))).click();
    return selectedSubMenu;
  }
}

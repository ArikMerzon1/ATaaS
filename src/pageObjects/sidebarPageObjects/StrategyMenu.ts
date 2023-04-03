import { container, inject, injectable } from "tsyringe";
import { By, ThenableWebDriver } from "selenium-webdriver";
import { IMenu } from "./IMenu";
import { StrategySubMenu } from "../../utils/Enums";
import { StrategyBuilderPageObject } from "../strategy/StrategyBuilderPageObject";
import { DecisionTreesPageObject } from "../strategy/decisionTreesPageObject";
import { SimulatorPageObject } from "../strategy/simulatorPageObject";
import { ReactionsPageObject } from "../strategy/reactionspageObject";
import helpers from "../../utils/helpers";

@injectable()
export class StrategyMenu implements IMenu {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async SelectFromSubMenu(selection: string): Promise<unknown> {
    console.log(`select menu form the subMenu list: ${selection}`);
    let selectedSubMenu: unknown;

    switch (selection) {
      case StrategySubMenu.STRATEGY_BUILDER:
        selectedSubMenu = container.resolve(StrategyBuilderPageObject);
        break;
      case StrategySubMenu.DECISION_TREE:
        selectedSubMenu = container.resolve(DecisionTreesPageObject);
        break;
      case StrategySubMenu.SIMULATOR:
        selectedSubMenu = container.resolve(SimulatorPageObject);
        break;
      case StrategySubMenu.REACTIONS:
        selectedSubMenu = container.resolve(ReactionsPageObject);
        break;
      default:
        throw new Error(`You've picked a menu not from the list please try again: ${selection}`);
    }

    await (await helpers.getElement(By.css(`[data-test-id="${selection}"]`))).click();
    return selectedSubMenu;
  }
}

export default { StrategyMenu };

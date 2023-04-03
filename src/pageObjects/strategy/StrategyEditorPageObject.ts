import { container, inject, injectable } from "tsyringe";
import { By, ThenableWebDriver, until } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import { StrategyActions } from "../../utils/Enums";
import StrategyActionSMSPo from "./StrategyActions/StrategyActionSMSPo";
import StrategyActionEmailPo from "./StrategyActions/StrategyActionEmailPo";
import { IAction } from "./StrategyActions/IAction";
import StrategyStepBasePo from "./StrategyActions/StrategyStepBasePo";
import StrategyActionFinancialAssessmentPo from "./StrategyActions/StrategyActionFinancialAssessmentPo";
import AccountToCallListPo from "./StrategyActions/AccountToCallListPo";
import IfConditionIsHolidayActionPo from "./StrategyActions/IfConditionIsHolidayActionPo";

@injectable()
export class StrategyEditorPageObject {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async SaveStrategy(): Promise<this> {
    console.log("SaveStrategy");
    const upperHud = await helpers.getElement(By.css(".is-flex.is-align-items-center"));
    const hudButtons = await helpers.getElementsWithinElement(upperHud, By.css(".button"));

    // await utils.HighLighterElement(hudButtons[2]);
    await helpers.sleep(2);
    await hudButtons[2].click();
    await helpers.waitForAttribute(hudButtons[2], "disabled");
    await helpers.sleep(2);
    return this;
  }

  async SearchForAction(actionName: StrategyActions): Promise<this> {
    console.log(`Searching for action name : ${actionName}`);
    await helpers.sleep(1);
    await this.webDriver.wait(until.elementLocated(By.className("input")));
    const searchField = await this.webDriver.findElement(By.className("input"));
    await searchField.clear();
    await searchField.sendKeys(actionName);
    return this;
  }

  async DrugAndDropObjects(): Promise<this> {
    console.log("DrugAndDropObjects");
    await this.webDriver.wait(until.elementLocated(By.className("strategy-builder-toolbar__steps__step")));
    const actionElement = await this.webDriver.findElement(By.className("strategy-builder-toolbar__steps__step"));
    console.log(`actionElement: ${await actionElement.getText()}`);

    const nodeTree = await this.webDriver.findElements(By.className("drawflow-node"));
    const innerLastNode = nodeTree[nodeTree.length - 1];
    console.log(`last node name ${await innerLastNode.getText()}`);

    const rect = await innerLastNode.getRect();
    console.log(`getLocation x:${rect.x} y:${rect.y}`);

    await helpers.sleep(1);
    await this.webDriver.actions().move({ origin: actionElement }).perform();
    await this.webDriver
      .actions()
      .press()
      .move({ origin: innerLastNode })
      .move({ x: rect.x + 70, y: rect.y + 150 })
      .perform();
    await this.webDriver.actions().release().perform();
    await helpers.takeScreenshot("place_action");
    return this;
  }

  async OpenProperties(actionName: StrategyActions, nodeName: string): Promise<IAction> {
    console.log(`SetProperties: ${actionName}`);

    await (await helpers.getElement(By.id(nodeName))).click();

    switch (actionName) {
      case StrategyActions.SMS:
      case StrategyActions.PLACE_CALL:
        return container.resolve(StrategyActionSMSPo);
      case StrategyActions.EMAIL:
      case StrategyActions.LETTER:
        return container.resolve(StrategyActionEmailPo);
      case StrategyActions.ENABLE_CALLBACK:
      case StrategyActions.DISABLE_CALLBACK:
      case StrategyActions.ENABLE_REPLIES:
      case StrategyActions.DISABLE_REPLIES:
        return container.resolve(StrategyStepBasePo);
      case StrategyActions.FINANCIAL_ASSESSMENT:
        return container.resolve(StrategyActionFinancialAssessmentPo);
      case StrategyActions.ADD_ACCOUNT_TO_CALL_LIST:
      case StrategyActions.REMOVE_ACCOUNT_TO_CALL_LIST:
        return container.resolve(AccountToCallListPo);
      case StrategyActions.EVALUATE_IF_CONDITION_IS_HOLIDAY:
        return container.resolve(IfConditionIsHolidayActionPo);
      default:
        throw new Error(`An action you've picked not supported yet: ${actionName}`);
    }
  }

  async GetIfConditionValues(operationSelector: By): Promise<{
    selectedVariable: string;
    selectedOperation: string;
    selectedValue: string;
  }> {
    const [conditionBuilder] = await helpers.getElements(By.css(`.condition-builder`));
    const dropdownVariable = await helpers.getElementWithinElement(conditionBuilder, By.className("dropdown-variable"), true, false, 5000);
    const selectedVariable = await dropdownVariable.getText();

    const dropdownOperation = await helpers.getElementWithinElement(conditionBuilder, By.className("condition-dropdown"), true, false, 5000);
    const selectedOperation = await dropdownOperation.getText();

    const dropdownValue = await helpers.getElementWithinElement(conditionBuilder, operationSelector, true, false, 5000);
    const inputElement = await helpers.getElementWithinElement(dropdownValue, By.className("input"));
    const selectedValue = await inputElement.getAttribute("value");

    return {
      selectedVariable,
      selectedOperation,
      selectedValue,
    };
  }

  async BackToStrategyBuilder(): Promise<void> {
    console.log("BackToStrategyBuilder");

    const flex = await helpers.getElement(By.css(".is-flex.is-flex-direction-column"));
    const button = await helpers.getElementWithinElement(flex, By.className("button"));
    await button.click();
    await helpers.waitForElement(By.className("strategy-builder__header__label"));
    await helpers.sleep(1);
  }
}

export default { StrategyEditorPageObject };

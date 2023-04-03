import { injectable } from "tsyringe";
import { By } from "selenium-webdriver";
import StrategyStepBasePo from "./StrategyStepBasePo";
import helpers from "../../../utils/helpers";

@injectable()
export default class IfConditionIsHolidayActionPo extends StrategyStepBasePo {
  async SetProperties(properties: string[]): Promise<this> {
    console.log("Set Properties");

    const [conditionBuilder] = await helpers.getElements(By.css(`.condition-builder`));

    const dropdownVariable = await helpers.getElementWithinElement(conditionBuilder, By.className("dropdown-variable"), true, false, 5000);
    await this.SelectDropdownList(dropdownVariable);
    await this.SearchInList(properties[0]);

    await helpers.sleep(2);

    const dropdownCondition = await helpers.getElementWithinElement(conditionBuilder, By.className("condition-dropdown"), true, false, 5000);
    await this.SelectDropdownList(dropdownCondition);
    await this.SelectItemFromLIst(properties[1]);

    await helpers.sleep(2);

    const [updatedConditionBuilder] = await helpers.getElements(By.css(`.condition-builder`));
    const dropdownValue = await helpers.getElementWithinElement(updatedConditionBuilder, By.css('[operation="IS_HOLIDAY_IN_COUNTRY"]'), true, false, 5000);

    await this.SelectItemFromGivenList(dropdownValue, By.className("input"), By.className("dropdown-item"), properties[2]);

    await helpers.takeScreenshot("set_properties");

    return this;
  }
}

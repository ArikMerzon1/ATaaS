import { By } from "selenium-webdriver";
import { injectable } from "tsyringe";
import StrategyStepBasePo from "./StrategyStepBasePo";
import helpers from "../../../utils/helpers";

@injectable()
export default class AccountToCallListPo extends StrategyStepBasePo {
  async SetProperties(properties: string[]): Promise<this> {
    console.log("Set Properties");

    const propFields = await helpers.getElements(By.css(`[data-test-id="strategy-builder-manager-step-editor-property-editor"]`));
    const label = await helpers.getElementWithinElement(propFields[0], By.className("label"), true, false, 5000);

    if ((await label.getText()).toLowerCase() === "call list") {
      await this.SelectDropdownList(propFields[0]);
      await this.SearchInList(properties[0]);
    }
    return this;
  }
}

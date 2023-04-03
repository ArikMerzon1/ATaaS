import { injectable } from "tsyringe";
import { By } from "selenium-webdriver";
import StrategyStepBasePo from "./StrategyStepBasePo";
import helpers from "../../../utils/helpers";

@injectable()
export default class StrategyActionSMSPo extends StrategyStepBasePo {
  async SetProperties(properties: string[]): Promise<this> {
    console.log("Set Properties");
    const testFields = await helpers.getElements(By.css(`.field.text-left`));
    for (const item of testFields) {
      const label = await helpers.getElementWithinElement(item, By.className("label"), true, false, 5000);
      if ((await label.getText()).toLowerCase() === "content") {
        await this.SelectDropdownList(item);
        await this.SearchInList(properties[0]);
      }
      if ((await label.getText()).toLowerCase() === "locale") {
        await this.SelectDropdownList(item);
        await this.SearchInList(properties[1]);
      }
      await helpers.sleep(2);
    }
    await helpers.takeScreenshot("set_properties");
    return this;
  }
}

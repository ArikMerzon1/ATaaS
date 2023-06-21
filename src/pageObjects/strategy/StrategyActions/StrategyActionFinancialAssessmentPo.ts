import { injectable } from "tsyringe";
import { By } from "selenium-webdriver";
import StrategyStepBasePo from "./StrategyStepBasePo";
import helpers from "../../../utils/helpers";

@injectable()
export default class StrategyActionFinancialAssessmentPo extends StrategyStepBasePo {
  async SetProperties(properties: string[]): Promise<this> {
    console.log("Set Properties");

    const propFields = await helpers.getElements(By.css(`.field.mb-4`));
    for (const item of propFields) {
      const label = await helpers.getElementWithinElement(item, By.className("label"), true, false, true, 5000);

      if ((await label.getText()).toLowerCase() === "select method of communication") {
        await this.SelectDropdownList(item);
        await this.SelectItemFromLIst(properties[0]);
      }
      if ((await label.getText()).toLowerCase() === "select template") {
        await this.SelectDropdownList(item);
        await this.SearchInList(properties[1]);
      }
      if ((await label.getText()).toLowerCase() === "select assessment form") {
        await this.SelectDropdownList(item);
        await this.SelectItemFromLIst(properties[2]);
      }
      await helpers.sleep(2);
    }
    await helpers.takeScreenshot("set_properties");
    return this;
  }
}

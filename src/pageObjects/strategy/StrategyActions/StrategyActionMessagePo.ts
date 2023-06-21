import { injectable } from "tsyringe";
import { By } from "selenium-webdriver";
import StrategyStepBasePo from "./StrategyStepBasePo";
import helpers from "../../../utils/helpers";

@injectable()
export default class StrategyActionMessagePo extends StrategyStepBasePo {
  async SetProperties(properties: string[]): Promise<this> {
    const stepEditor = await helpers.getElement(By.css(".step-editor"));
    const fields = await helpers.getElementsWithinElement(stepEditor, By.css(".field"));

    for (const field of fields) {
      const fieldLabel = By.className("label");
      const label = await helpers.getElementWithinElement(field, fieldLabel, true, false, true, 5000);

      if ((await label.getText()).toLowerCase() === "content") {
        await this.SelectDropdownList(field);
        await this.SearchInList(properties[0]);
      }

      if ((await label.getText()).toLowerCase() === "locale") {
        await this.SelectDropdownList(field);
        await this.SearchInList(properties[1]);
      }

      await helpers.sleep(2);
    }

    await helpers.takeScreenshot("set_properties");

    return this;
  }
}

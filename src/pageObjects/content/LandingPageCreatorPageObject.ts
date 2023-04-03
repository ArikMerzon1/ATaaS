import { inject, injectable } from "tsyringe";
import { By, ThenableWebDriver } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import ContentCreatorBase from "./ContentCreatorBase";

@injectable()
export default class LandingPageCreatorPageObject extends ContentCreatorBase {
  constructor(@inject("webDriver") readonly webDriver: ThenableWebDriver) {
    super();
  }

  async setLandingPageName(name: string): Promise<this> {
    console.log("setLandingPageName");
    await (await helpers.getElement(By.css(`[data-test-id="name-input"]`))).sendKeys(name);
    await (await helpers.getElement(By.css(`[data-test-id="name-continue-btn"]`))).click();
    return this;
  }

  async setPageTitle(pageName: string, approve = true): Promise<this> {
    console.log("SetPageTitle");
    await (await helpers.getElement(By.css(`[data-test-id="title-input"]`))).sendKeys(pageName);

    if (approve) {
      await (await helpers.getElement(By.css(`[data-test-id="title-continue-btn"]`))).click();
    } else {
      await (await helpers.getElement(By.css(`[data-test-id="title-cancel-btn"]`))).click();
    }
    return this;
  }
}

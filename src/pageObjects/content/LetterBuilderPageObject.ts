import { By, WebElement } from "selenium-webdriver";
import { container, injectable } from "tsyringe";
import ContentBuildBase from "./ContentBuildBase";
import helpers from "../../utils/helpers";
import LetterCreatorPageObject from "./LetterCreatorPageObject";

@injectable()
export default class LetterBuilderPageObject extends ContentBuildBase {
  async findLetterByName(landingPageName: string): Promise<WebElement> {
    console.log("FindLetterByName");
    return this.findContentByName(landingPageName);
  }

  async createLetterContext(name: string, designTemplate: string): Promise<LetterCreatorPageObject> {
    try {
      console.log("CreateLetterContext");
      await helpers.waitForElement(By.className("grid"), false, true, true, 8000);
      await (await helpers.getElement(By.css('[data-test-id="bundle-create-btn"]'))).click();

      const nameInput = await helpers.getElement(By.css('[data-test-id="email-name-input"]'));
      await helpers.sendKeys(nameInput, name);

      await (await helpers.getElement(By.css(".button.is-fullwidth.dropdown-button"))).click();
      const input = await helpers.getElement(By.css(".control.search-input.has-icons-left.has-icons-right.is-clearfix .input"));
      await helpers.sendKeys(input, designTemplate);

      const designTemplateList = await helpers.getElements(By.css(".r-dropdown-item"));
      await designTemplateList[0].click();

      await (await helpers.getElement(By.css('[data-test-id="email-continue-btn"]'))).click();

      return container.resolve(LetterCreatorPageObject);
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }
}

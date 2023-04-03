import { container, injectable } from "tsyringe";
import { By, WebElement } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import EmailCreatorPageObject from "./EmailCreatorPageObject";
import ContentBuildBase from "./ContentBuildBase";

@injectable()
export default class EmailBuilderPageObject extends ContentBuildBase {
  async findEmailPageByName(emailPageName: string): Promise<WebElement> {
    console.log("FindEmailPageByName");
    return this.findContentByName(emailPageName);
  }

  async createEmail(withTemplateName = "Blank template"): Promise<EmailCreatorPageObject> {
    console.log("CreateEmail");
    try {
      await helpers.waitForElement(By.className("grid"), false, true, 8000);
      await (await helpers.getElement(By.css('[data-test-id="bundle-create-btn"]'), false, true, 2000, 500, 20)).click();

      const templatesMap = new Map<string, WebElement>();
      const templates = await helpers.getElements(By.css(".design-element.column.is-4"));

      for (const item of templates) {
        const tag = await helpers.getElementWithinElement(item, By.css("h3"));
        templatesMap.set(await tag.getText(), item);
      }

      const selectedTemplate = await templatesMap.get(withTemplateName);
      await selectedTemplate?.click();

      return container.resolve(EmailCreatorPageObject);
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }
}

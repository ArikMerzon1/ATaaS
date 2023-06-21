import { container, injectable } from "tsyringe";
import { By, WebElement } from "selenium-webdriver";
import ContentBuildBase from "./ContentBuildBase";
import MessageCreatorPageObject from "./MessageCreatorPageObject";
import helpers from "../../utils/helpers";

@injectable()
export default class MessagingBuilderPageObject extends ContentBuildBase {
  async findMessageByName(landingPageName: string): Promise<WebElement> {
    console.log("FindMessageByName");
    return this.findContentByName(landingPageName);
  }

  async createMessagingContext(name: string): Promise<MessageCreatorPageObject> {
    try {
      console.log("CreateMessagingContext");
      await helpers.waitForElement(By.className("grid"), false, true, true, 8000);
      await (await helpers.getElement(By.css('[data-test-id="bundle-create-btn"]'), false, true, true, 2000, 500, 20)).click();

      const nameInput = await helpers.getElement(By.css('[data-test-id="email-name-input"]'));
      await helpers.sendKeys(nameInput, name);

      await (await helpers.getElement(By.css('[data-test-id="email-continue-btn"]'))).click();

      return container.resolve(MessageCreatorPageObject);
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }
}

import { By } from "selenium-webdriver";
import { injectable } from "tsyringe";
import ContentCreatorBase from "./ContentCreatorBase";
import helpers from "../../utils/helpers";

@injectable()
export default class MessageCreatorPageObject extends ContentCreatorBase {
  async setSmsSender(sender: string): Promise<this> {
    try {
      console.log("SetSmsSender");

      await (await helpers.getElement(By.css(".button.is-fullwidth.dropdown-button"))).click();

      const senders = await helpers.getElements(By.css(".r-dropdown-item"));

      for (const item of senders) {
        if ((await item.getText()) === sender) {
          await item.click();
          break;
        }
      }
      return this;
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }

  async setSmsName(name: string): Promise<this> {
    try {
      console.log("SetSmsName");

      const smsName = await helpers.getElement(By.css('[data-test-id="display-name-input"]'));
      await helpers.sendKeys(smsName, name);

      return this;
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }

  async setCategory(categoryName: string): Promise<this> {
    try {
      console.log("SetCategory");
      const category = await helpers.getElement(By.css(".control.has-icons-left.is-clearfix .input"));
      await category.click();

      await helpers.sleep(2);

      const categoryDropdown = await helpers.getElements(By.css(".dropdown-item"));
      console.log(await categoryDropdown[10].getText());
      await categoryDropdown[10].click();

      return this;
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }

  async setBody(msgBody: string): Promise<this> {
    try {
      console.log("SetBody");
      const body = await helpers.getElement(By.css(".textarea"));
      await helpers.sendKeys(body, msgBody);

      return this;
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }

  async setAccessibleByAgents(): Promise<this> {
    try {
      console.log("SetAccessibleByAgents");

      await (await helpers.getElement(By.css('[data-test-id="agent-checkbox"]'))).click();

      return this;
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }
}

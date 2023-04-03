import { By, WebDriver, WebElement, WebElementPromise } from "selenium-webdriver";
import { container } from "tsyringe";
import FindElementError from "../errors/FindElementError";

export default class HelpersBase {
  public static async findElements(selector: By): Promise<WebElement[]> {
    try {
      const webDriver: WebDriver = container.resolve("webDriver");
      return webDriver.findElements(selector);
    } catch (error) {
      console.log("FindElementError", error);
      throw new FindElementError(JSON.stringify(error, null, 2));
    }
  }

  public static async findElement(selector: By): Promise<WebElement> {
    try {
      const webDriver: WebDriver = container.resolve("webDriver");
      return webDriver.findElement(selector);
    } catch (error) {
      console.log("FindElementError", error);
      throw new FindElementError(JSON.stringify(error, null, 2));
    }
  }

  public static async isDisplayed(element: WebElement): Promise<boolean> {
    try {
      return await element.isDisplayed();
    } catch (error) {
      throw new FindElementError(JSON.stringify(error, null, 2));
    }
  }
}

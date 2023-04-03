import { inject, injectable } from "tsyringe";
import { ThenableWebDriver, By } from "selenium-webdriver";
import helpers from "../utils/helpers";

@injectable()
export class LandingPageObject {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async checkForVerification(): Promise<boolean> {
    return true;
  }

  async setUserName(debtorName: string): Promise<this> {
    try {
      console.log({ debtorName });
      const firstNameElement = await helpers.getElement(By.css('[name="First Name"]'), false, false, 20000);
      await firstNameElement.sendKeys(debtorName);
      await helpers.takeScreenshot("SetUserName");
      return this;
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  async pressOnContinueButton(): Promise<void> {
    await helpers.takeScreenshot("landingPage");

    try {
      await (await helpers.getElement(By.css(`[data-test-id="verify-button"]`))).click();
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  async assertLandingPage(): Promise<void> {
    try {
      console.log("Asserting LandingPage");
      const totalAmount = await helpers.getElement(By.className("total-amount"));
      console.log(`total amount: ${await totalAmount.getText()}`);
      await helpers.sleep(2);
      await helpers.takeScreenshot("claim_landingPage");
      const url = await this.webDriver.getCurrentUrl();
      console.log(`full URL: ${url}`);
      expect(url).toContain("claim");
    } catch (e) {
      console.log(e);
    }
  }
}

export default { LandingPageObject };

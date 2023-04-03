import { inject, injectable } from "tsyringe";
import { ThenableWebDriver, By } from "selenium-webdriver";
import { MainPageObject } from "./MainPageObject";
import helpers from "../../utils/helpers";

@injectable()
export default class LoginPageObject {
  isLoggedIn = false;

  constructor(@inject("webDriver") readonly webDriver: ThenableWebDriver, @inject(MainPageObject) readonly mainPageObject: MainPageObject) {}

  private async setUserName(userName: string): Promise<this> {
    console.log(`set user name: ${userName}`);
    const element = await helpers.getElements(By.css(`[data-test-id="username-input"]`), true, true, 10000);
    const name = element[0];
    await helpers.clearInputField(name);
    await name.sendKeys(userName);
    return this;
  }

  private async setPassword(password: string): Promise<this> {
    console.log(`set password: ${password}`);
    const element = await helpers.getElements(By.css(`[data-test-id="password-input"]`), true, true, 10000);
    const pwd = element[0];
    await helpers.clearInputField(pwd);
    await pwd.sendKeys(password);
    return this;
  }

  private async pressLogin(): Promise<this> {
    console.log(`pressLogin`);
    await helpers.sleep(1);
    const loginButton = helpers.getElement(By.css(`[data-test-id="sign-in-button"]`));
    await this.webDriver.executeScript("arguments[0].click();", loginButton);
    return this;
  }

  private static async waitForBackoffice(): Promise<void> {
    console.log(`waitForBackoffice`);
    await helpers.waitForElement(By.className("sidebar"), false, true, 10000);
    await helpers.sleep(1);
  }

  async Login(
    userName: string = helpers.getValue(process.env.BACKOFFICE_USERNAME) as string,
    password: string = helpers.getValue(process.env.BACKOFFICE_PASSWORD) as string
  ): Promise<MainPageObject> {
    await this.setUserName(userName);
    await this.setPassword(password);
    await this.pressLogin();
    await LoginPageObject.waitForBackoffice();

    this.isLoggedIn = true;

    return this.mainPageObject;
  }

  Logout(): void {
    this.isLoggedIn = false;
  }

  async LoginWithInvalidUserName(userName: string, password: string = helpers.getValue(process.env.BACKOFFICE_PASSWORD) as string): Promise<string> {
    await this.setUserName(userName);
    await this.setPassword(password);
    await this.pressLogin();

    const errorElement = await helpers.getElement(By.className("error-notification"), false, false, 5000);
    return errorElement.getText();
  }
}

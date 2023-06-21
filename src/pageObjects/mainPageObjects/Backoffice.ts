import { container, inject, injectable } from "tsyringe";
import { By, ThenableWebDriver } from "selenium-webdriver";
import LoginPageObject from "./LoginPageObject";
import SidebarPageObject from "../sidebarPageObjects/SidebarPageObject";
import helpers from "../../utils/helpers";

@injectable()
export class Backoffice {
  private loginPage: LoginPageObject | null = null;

  constructor(
    @inject(SidebarPageObject) private readonly sidebarPageObject: SidebarPageObject,
    @inject("webDriver") private readonly webDriver: ThenableWebDriver
  ) {}

  LoginPage(): LoginPageObject {
    if (!this.loginPage) {
      this.loginPage = container.resolve(LoginPageObject);
    }

    return this.loginPage;
  }

  async Logout(): Promise<void> {
    try {
      console.log("Logout");
      await (await helpers.getElement(By.css(`[data-test-id="Logout"]`), false, false, false)).click();
      await helpers.waitForElement(By.className("login-title"));
      await helpers.sleep(1);

      if (this.loginPage) {
        this.loginPage.Logout();
      }
    } catch (err) {
      console.error(err);
    }
  }

  SidebarMenu(): SidebarPageObject {
    return this.sidebarPageObject;
  }

  async ReloadPage(): Promise<void> {
    await this.webDriver.navigate().refresh();
  }

  async QuitWebdriver(): Promise<void> {
    console.log("Quit Webdriver");
    await this.webDriver.quit();
    await helpers.sleep(2);
  }

  async CloseBrowser(): Promise<void> {
    console.log("Close Browser");
    await this.webDriver.close();
    await helpers.sleep(1);
  }

  async GoToMainTab(): Promise<void> {
    await this.webDriver.switchTo().window((await this.webDriver.getAllWindowHandles())[0]);
  }
}

export default { Backoffice };

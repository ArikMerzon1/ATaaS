import { container, injectable } from "tsyringe";
import { By, WebElement } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import LandingPageCreatorPageObject from "./LandingPageCreatorPageObject";
import ContentBuildBase from "./ContentBuildBase";

@injectable()
export default class LandingPageBuilderPageObject extends ContentBuildBase {
  async findLandingPageByName(landingPageName: string): Promise<WebElement> {
    console.log("FindLandingPageByName");
    return this.findContentByName(landingPageName);
  }

  async exportLandingPageByName(_landingPageName: string): Promise<void> {
    throw new Error("not implemented");
  }

  async exportAllLandingPages(): Promise<void> {
    throw new Error("not implemented");
  }

  async createLandingPage(withTemplate: boolean): Promise<LandingPageCreatorPageObject> {
    console.log("createLandingPage");
    try {
      await helpers.waitForElement(By.className("grid"), false, true, 8000);
      await (await helpers.getElement(By.css('[data-test-id="bundle-create-btn"]'), false, true, 2000, 500, 20)).click();

      if (withTemplate) {
        const element = await helpers.getElement(By.css('[data-test-id="design-18591"]'));
        await element.click();
      } else {
        const element = await helpers.getElement(By.css(".design-element.column.is-4"));
        await element.click();
      }
      return container.resolve(LandingPageCreatorPageObject);
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }
}

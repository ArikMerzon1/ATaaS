import { WebElement } from "selenium-webdriver";
import { injectable } from "tsyringe";
import ContentBuildBase from "./ContentBuildBase";

@injectable()
export default class RobocallBuilderPageObject extends ContentBuildBase {
  async findBobocallrByName(landingPageName: string): Promise<WebElement> {
    console.log("FindBobocallrByName");
    return this.findContentByName(landingPageName);
  }
}

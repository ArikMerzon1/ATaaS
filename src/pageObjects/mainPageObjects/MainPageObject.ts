import { inject, injectable } from "tsyringe";
import { ThenableWebDriver } from "selenium-webdriver";
import { IMenu } from "../sidebarPageObjects/IMenu";
import SidebarPageObject from "../sidebarPageObjects/SidebarPageObject";

@injectable()
export class MainPageObject implements IMenu {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver, @inject(SidebarPageObject) readonly sidebarPageObject: SidebarPageObject) {}

  SidebarMenu(): SidebarPageObject {
    return this.sidebarPageObject;
  }

  SelectFromSubMenu(_selection: string): unknown {
    return Promise.resolve("undefined");
  }
}

export default { MainPageObject };

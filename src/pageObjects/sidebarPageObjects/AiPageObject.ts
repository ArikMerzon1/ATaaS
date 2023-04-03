import { ThenableWebDriver } from "selenium-webdriver";
import { inject, injectable } from "tsyringe";
import { IMenu } from "./IMenu";

@injectable()
export class AiPageObject implements IMenu {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  SelectFromSubMenu(_selection: string): Promise<unknown> {
    return Promise.resolve(undefined);
  }
}

export default { AiPageObject };

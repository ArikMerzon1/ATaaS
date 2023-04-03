import { ThenableWebDriver } from "selenium-webdriver";
import { inject, injectable } from "tsyringe";

@injectable()
export class DecisionTreesPageObject {
  constructor(@inject("webDriver") readonly webDriver: ThenableWebDriver) {}
}

export default { DecisionTreesPageObject };

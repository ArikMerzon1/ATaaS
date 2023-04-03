import { container, inject, injectable } from "tsyringe";
import { By, Key, ThenableWebDriver } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import AccountPageObject from "./AccountPageObject";

@injectable()
export default class AccountOverviewPageObject {
  constructor(@inject("webDriver") readonly webDriver: ThenableWebDriver) {}

  async SearchAccount(accountId: string): Promise<this> {
    try {
      console.log("SearchAccount");
      const searchAccount = helpers.getElement(By.className("input"));
      await searchAccount.then(async (_) => {
        await _.sendKeys(accountId);
        await helpers.sleep(2);
        await _.sendKeys(Key.ENTER);
      });
      await helpers.sleep(2);
      await helpers.takeScreenshot("searchAccountResults");
      // ToDo VerifyClaimInList(claimID)
      return this;
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  async SelectFirstAccount(): Promise<AccountPageObject> {
    console.log("SelectFirstAccount");
    const account = await helpers.getElement(By.className("link-block"));
    await account.click();
    await helpers.waitForElement(By.className("mdi-chevron-left"));
    return container.resolve(AccountPageObject);
  }
}

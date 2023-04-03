import { inject, injectable } from "tsyringe";
import { By, ThenableWebDriver, until } from "selenium-webdriver";
import { Claim } from "@receeve-gmbh/account-api/Claim";
import helpers from "../../utils/helpers";

@injectable()
export class SimulatorPageObject {
  constructor(@inject("webDriver") readonly webDriver: ThenableWebDriver) {}

  async Start(): Promise<void> {
    const str = "button mr-4 is-primary";
    await this.webDriver.wait(until.elementLocated(By.className(str)));
    const startButton = await this.webDriver.findElement(By.className(str));
    await startButton.click();
    await helpers.sleep(1);
  }

  async Reset(): Promise<void> {
    await helpers.getElement(By.className("button.mb-4.is-warning")).then((_) => _.click());
  }

  async SelectTab(): Promise<void> {
    /// todo: select tab in simulator
  }

  async SetClaimParameters(claim: Claim): Promise<void> {
    const claimID = await this.webDriver.findElement(By.css(`[data-test-id="simulator-claim-id"]`));
    await claimID.sendKeys(claim.externalPortfolioRef ?? "");

    const dueDate = await this.webDriver.findElement(By.css(`[data-test-id="simulator-due-date"]`));
    await dueDate.sendKeys(claim.externalPortfolioRef ?? "");
  }

  async GetClaimID(): Promise<string> {
    console.log(`get claim ID`);
    try {
      const claimID = await this.webDriver.findElement(By.css(`[data-test-id="simulator-claim-id"]`));
      return claimID.getAttribute("value");
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  async GetFirstName(): Promise<string> {
    console.log(`get First Name ID`);
    const claimID = await this.webDriver.findElement(By.css(`[data-test-id="simulator-first-name"]`));
    return claimID.getAttribute("value");
  }

  async SetClaimID(claimId: string): Promise<this> {
    const claimID = await this.webDriver.findElement(By.css(`[data-test-id="simulator-claim-id"]`));
    await helpers.clearInputField(claimID);
    await claimID.sendKeys(claimId);
    return this;
  }
}

export default { SimulatorPageObject };

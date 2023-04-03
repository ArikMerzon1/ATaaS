import { container, inject, injectable } from "tsyringe";
import { By, ThenableWebDriver } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import { LandingPageObject } from "../LandingPageObject";
import { TitlesList } from "../../utils/Enums";

@injectable()
export default class ClaimPageObject {
  constructor(@inject("webDriver") readonly webDriver: ThenableWebDriver) {}

  private async GetLandingPageLink(): Promise<void> {
    try {
      const lpLinkButton = await helpers.getElement(By.css(`[data-test-id="claim-pl-button"]`));
      let lpLink;
      do {
        console.log("Waiting for LP link...");
        await helpers.sleep(2);
        lpLink = await lpLinkButton.getAttribute("href");
        console.log(`landing page: ${lpLink}`);
      } while (lpLink === null);

      console.log(`landing page link: ${lpLink}`);
      await this.webDriver.switchTo().newWindow("tab");
      await this.webDriver.get(lpLink);
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  async OpenLandingPage(): Promise<LandingPageObject> {
    await this.GetLandingPageLink();
    return container.resolve(LandingPageObject);
  }

  async GetDebtorFirstName(): Promise<string> {
    console.log("GetDebtorFirstName");
    const nameProp = await helpers.getElement(By.css(`[data-test-id="name"]`), false, true, 4000);
    const debtorFullName = await helpers.getElementWithinElement(nameProp, By.className("debtor-field__value"));
    const name = (await debtorFullName.getText()).split(" ");
    if (Object.values<string>(TitlesList).includes(name[0])) {
      return name[1];
    }
    return name[0];
  }

  async GetClaimStatus(): Promise<string> {
    console.log("GetClaimStatus");
    const [claimStatus] = await Promise.all([(await helpers.getElement(By.css(`[data-test-id="claim-status"]`), false)).getText()]);
    return claimStatus;
  }
}

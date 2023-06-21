import { container, injectable } from "tsyringe";
import { By } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import ClaimPageObject from "./ClaimPageObject";

@injectable()
export class ClaimOverviewPageObject {
  async SearchClaim(claimID: string): Promise<this> {
    console.log(`searching for claimID: ${claimID}`);
    try {
      const searchClaim = await helpers.getElement(By.css(`[data-test-id="claim-table-insight-search-input"]`));
      await searchClaim.sendKeys(claimID);
      if (await this.VerifyClaimInList(claimID)) console.log("ClaimID in the list");
      await helpers.takeScreenshot("claim_search_results");
      return this;
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }

  async VerifyClaimInList(claimID: string): Promise<boolean> {
    console.log("VerifyClaimInList");
    const table = await helpers.getElement(By.css(`[data-test-id="claim-table-container"]`));
    const list = await helpers.getElementsWithinElement(table, By.css("tr"));
    list.forEach((line) => {
      line.getId().then((id) => {
        console.log(`claimID visible: ${id}`);
        if (id.includes(claimID)) return true;
        return id;
      });
    });
    return false;
  }

  async SelectFirstClaim(): Promise<ClaimPageObject> {
    console.log("SelectFirstClaim");
    // await (await helpers.GetElement(By.css('[data-label="Claim reference"]'))).click();
    await (await helpers.getElement(By.css('[data-test-id="claim-table-insight-column"]'))).click();
    return container.resolve(ClaimPageObject);
  }
}

export default { ClaimOverviewPageObject };

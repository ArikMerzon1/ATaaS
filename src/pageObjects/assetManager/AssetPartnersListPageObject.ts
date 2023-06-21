import { container, inject, injectable } from "tsyringe";
import { By, ThenableWebDriver, WebElement } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import AssetPartnerPageObject from "./AssetPartnerPageObject";

@injectable()
export default class AssetPartnersPageObject {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  public async getPartnerTypes(): Promise<string[]> {
    await helpers.sleep(1);
    const partnerTypeElement = await helpers.getElements(By.css('[data-label="Partner Type"]'));

    const returnArray: string[] = [];
    for (const element of partnerTypeElement) {
      const text = await element.getText();
      returnArray.push(text);
    }

    return returnArray;
  }

  public async getElementFromAttribute(testId: string, attributeName = "data-test-id"): Promise<WebElement> {
    const selector = `[${attributeName}="${testId}"]`;
    return helpers.getElement(By.css(selector));
  }

  public async selectPartnerTypeExternal(): Promise<void> {
    const partnerTypeDropDown = await this.getElementFromAttribute("partner-type-dropdown");
    await partnerTypeDropDown.click();
    await helpers.sleep(1);
    const partnerType = await this.getElementFromAttribute("External_0");
    await partnerType.click();
  }

  public async selectFirstPartner(): Promise<AssetPartnerPageObject> {
    const partnerTypeElement = await this.getElementFromAttribute("Name / ID", "data-label");
    if (partnerTypeElement) await partnerTypeElement.click();

    await this.waitForPartnerDetailsToLoad();
    return container.resolve(AssetPartnerPageObject);
  }

  public async waitForPartnerDetailsToLoad(): Promise<void> {
    await helpers.sleep(1);
    await helpers.waitForText(By.css('[data-test-id="partner-save-button"]'), "Save");
  }

  public async getFirstPartnerName(): Promise<string> {
    const partnerTypeElement = await this.getElementFromAttribute("Name / ID", "data-label");
    return partnerTypeElement.getText();
  }

  public async checkDataExists(): Promise<boolean> {
    const count = await this.getPartnersCount();
    return Boolean(count);
  }

  public async getPartnersCount(): Promise<number> {
    const partnerTypeElements = await helpers.getElements(By.css("tr.table-row"), true, true, true, 5000, 1000);
    if (partnerTypeElements.length) return partnerTypeElements.length;
    return 0;
  }

  public async searchPartnerWithFirstPartnerName(): Promise<void> {
    const partnerName = await this.getFirstPartnerName();
    const searchInput = await this.getElementFromAttribute("partners-search-input");
    await searchInput.sendKeys(partnerName);
    await this.waitForGetPatnerCallToFinish();
  }

  public async waitForGetPatnerCallToFinish(): Promise<void> {
    await helpers.sleep(1);
    await helpers.waitForNetworkCallToFinish();
  }
}

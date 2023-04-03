import { inject, injectable } from "tsyringe";
import { By, ThenableWebDriver, WebElement } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import { PartnerType } from "../../utils/Enums";

enum PartnerSelector {
  INTERNAL = "Internal_1",
  EXTERNAL = "External_0",
}

enum IntervalSelector {
  DAY = "Day_0",
  WEEK = "Week_1",
}

enum OutsourceMethodSelector {
  COEO = "Coeo_0",
  IDFINANCE = "Idfinance_1",
  PAIGO = "Paigo_2",
}

@injectable()
export default class AssetPartnerPageObject {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}
  public testEmail!: string;

  public async getPartnerName(): Promise<string> {
    const partnerNameElement = await helpers.getElement(By.css('[data-test-id="partner-name"]'));
    return partnerNameElement.getText();
  }

  public async getPartnerEditEmail(): Promise<string> {
    await this.clickElement('[data-test-id="partner-details-edit-button"]');

    const emailInput = await helpers.getElement(By.css("input"));
    await helpers.sendKeys(emailInput, this.getRendomEmail());

    await this.clickElement('[data-test-id="partner-save-button"]');

    await this.waitForSaveCallToFinish('[data-test-id="partner-save-button"]');

    const emailTextElement = await helpers.getElement(By.css(".contact-item"));
    return emailTextElement.getText();
  }

  public async waitForSaveCallToFinish(selector: string): Promise<void> {
    try {
      await helpers.sleep(1);
      await helpers.waitForText(By.css(`${selector}`), "Save");
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  }

  public getRendomEmail(): string {
    if (!this.testEmail) {
      const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
      let string = "";
      for (let i = 0; i < 15; i++) {
        string += chars[Math.floor(Math.random() * chars.length)];
      }
      this.testEmail = `${string}@exness.com`;
    }
    return this.testEmail;
  }

  public async getIsButtonDisabled(selector: string): Promise<boolean> {
    const element = await helpers.getElement(By.css(selector));
    const isDisabled = await element.getAttribute("disabled");
    return Boolean(isDisabled);
  }

  public async getIsSaveAndRevertButtonDisabled(): Promise<boolean> {
    const revertButtonState = await this.getIsButtonDisabled('[data-test-id="partner-revert-button"]');
    const saveButtonState = await this.getIsButtonDisabled('[data-test-id="partner-save-button"]');
    return revertButtonState && saveButtonState;
  }

  public async getIsSaveAndRevertButtonDisabledAfterEdit(): Promise<boolean> {
    await this.clickElement('[data-test-id="partner-details-edit-button"]');

    const TEST_EMAIL = "123@exness.com";

    const emailInput = await helpers.getElement(By.css("input"));
    await helpers.sendKeys(emailInput, TEST_EMAIL);

    const revertButtonState = await this.getIsButtonDisabled('[data-test-id="partner-revert-button"]');
    const saveButtonState = await this.getIsButtonDisabled('[data-test-id="partner-save-button"]');

    const returnValue = revertButtonState || saveButtonState;

    await this.clickElement('[data-test-id="partner-details-cancel-button"]');
    return returnValue;
  }

  public async getPartnerType(): Promise<PartnerType> {
    const partnerTypeTextElement = await helpers.getElement(By.css('[data-test-id="partner-type"]'));
    const partnerTypeText = await partnerTypeTextElement.getText();
    const type = partnerTypeText.split(" ")?.[0].toUpperCase();
    return type as PartnerType;
  }

  public async getPartnerDetailsTabs(): Promise<number> {
    return (await helpers.getElements(By.css('li[role="tab"]'))).length;
  }

  public async getPartnerDetailsSections(): Promise<{ contactDetails: boolean; configurationDetails: boolean }> {
    const contactDetails = await helpers.checkIfElementExists(By.css(".card .contact-item"));

    const configurationDetails = await helpers.checkIfElementExists(By.css(".card .schedule-details"));

    return { contactDetails, configurationDetails };
  }

  private async clickElement(selector: string): Promise<void> {
    const element = await helpers.getElement(By.css(selector));
    await element.click();

    await helpers.sleep(1);
  }

  public async openConfigurations(): Promise<void> {
    await this.clickElement('[data-test-id="partner-configuration-button"]');
  }

  public async changePartnerType(selector: PartnerSelector): Promise<void> {
    await this.clickElement('[data-test-id="configuration-type"]');
    await this.clickElement(`[data-test-id="${selector}"]`);
  }

  public async changeInterval(selector: IntervalSelector): Promise<void> {
    await this.clickElement('[data-test-id="configuration-interval"]');
    await this.clickElement(`[data-test-id="${selector}"]`);
  }

  public async changeOutsourceMethod(selector: OutsourceMethodSelector): Promise<void> {
    await this.clickElement('[data-test-id="configuration-outsource-method"]');
    await this.clickElement(`[data-test-id="${selector}"]`);
  }

  public async changePartnerTypeToInternal(): Promise<void> {
    await this.openConfigurations();
    await this.changePartnerType(PartnerSelector.INTERNAL);
    await this.clickElement('[data-test-id="configuration-save-button"]');

    await this.waitForSaveCallToFinish('[data-test-id="configuration-save-button"]');
  }

  public async changePartnerTypeToExternalWithEmptyValues(): Promise<void> {
    await this.openConfigurations();
    await this.changePartnerType(PartnerSelector.EXTERNAL);
    await this.clickElement('[data-test-id="configuration-save-button"]');
  }

  public async changePartnerTypeToExternalWithValidValues(): Promise<void> {
    await this.openConfigurations();
    await this.changePartnerType(PartnerSelector.EXTERNAL);
    await this.changeInterval(IntervalSelector.DAY);
    await this.changeOutsourceMethod(OutsourceMethodSelector.IDFINANCE);
    await this.selectTime();

    await this.clickElement('[data-test-id="configuration-save-button"]');

    await this.waitForSaveCallToFinish('[data-test-id="configuration-save-button"]');

    await this.clickElement('[data-test-id="configuration-cancel-button"]');
  }

  public async selectTime(): Promise<void> {
    const input = await this.clickElement('[data-test-id="configuration-time"]');
    const selectElements = await helpers.getElements(By.css("select"));

    for (const element of selectElements) {
      const index = selectElements.indexOf(element);
      if (index > 1) continue;
      if (index === 0) await this.selectByVisibleText(element, "1");
      else {
        await this.selectByVisibleText(element, "01");
      }

      await helpers.sleep(1);
    }

    await helpers.sleep(1);
    await this.clickElement(".drawer-headline h3");
  }

  async selectByVisibleText(select: WebElement, textDesired: string): Promise<void> {
    const options = await select.findElements(By.css("option"));
    for (const option of options) {
      const text = await option.getText();
      if (text === textDesired) {
        await option.click();
      }
    }
  }

  public async getErrorMessages(): Promise<string[]> {
    const errorElements = await helpers.getElements(By.css(".help.is-danger"));
    const errorMessages: string[] = [];
    for (const element of errorElements) {
      const text = await element.getText();
      errorMessages.push(text);
    }
    await this.clickElement('[data-test-id="configuration-cancel-button"]');

    return errorMessages;
  }
}

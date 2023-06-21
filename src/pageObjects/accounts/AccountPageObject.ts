import { AccountRestructuringNotificationSchedule } from "@receeve-gmbh/account-api/AccountRestructuringNotificationSchedule";
import { inject, injectable } from "tsyringe";
import { By, ThenableWebDriver } from "selenium-webdriver";
import helpers from "../../utils/helpers";

@injectable()
export default class AccountPageObject {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  public async GetHeader(): Promise<void> {
    console.log("GetHeader");
    const accountName = await helpers.getElement(By.css(".account__title h1"));
    const accountExtRef = await helpers.getElement(By.css(".account__title h2"));

    console.log(await accountName.getText());
    console.log(await accountExtRef.getText());
  }

  public async GetUnpaidAmount(): Promise<number> {
    console.log("GetUnpaidAmount");
    await helpers.sleep(2);
    const amountElement = await helpers.getElement(By.css(`[data-test-id="unpaid-amount"]`));
    const amount = await amountElement.getText();
    console.log(`Unpaid amount: ${amount}`);

    let empty = "";
    const result = amount.match(/\d+/g);

    if (result) {
      result.forEach((item) => {
        empty += item;
      });
    }

    const number = parseFloat(empty);
    if (Number(number)) return number / 100;

    throw Error("Couldn't get the Unpaid Amount for UI");
  }

  public async RestructureAccount(reminderOptions: {
    locale: string;
    emailTemplate: string;
    scheduleType: AccountRestructuringNotificationSchedule["type"];
    days?: number;
  }): Promise<void> {
    const actionsButton = await helpers.getElement(By.className("actions-btn"));
    await actionsButton.click();

    const restructureAccountOption = await helpers.getElement(By.css("[data-test-id='restructure-account']"));
    await restructureAccountOption.click();

    const restructureDrawer = await helpers.getElement(By.className("drawer-body"));
    const drawerForm = await helpers.getElementWithinElement(restructureDrawer, By.className("restucture-account"));

    const instalmentDatePickerContainer = await helpers.getElementWithinElement(drawerForm, By.className("datepicker"));
    const instalmentDatePickerInput = await helpers.getElementWithinElement(instalmentDatePickerContainer, By.className("input"));
    await instalmentDatePickerInput.click();

    const todaysDate = await helpers.getElementWithinElement(restructureDrawer, By.css(".is-today.is-selectable"));
    await todaysDate.click();

    const simulateRestructureButton = await helpers.getElementWithinElement(restructureDrawer, By.css("button.confirm.is-primary"));
    await simulateRestructureButton.click();

    const setupEmailRemindersCheckbox = await helpers.getElementWithinElement(restructureDrawer, By.css("label.checkbox"));
    await setupEmailRemindersCheckbox.click();

    const localeSelector = await helpers.getElementWithinElement(restructureDrawer, By.css("[data-test-id='locale-selector']"));
    const localeSelectorButton = await helpers.getElementWithinElement(localeSelector, By.css(".button"));
    await localeSelectorButton.click();

    const localeInput = await helpers.getElement(By.css(".search-input .input"));
    await localeInput.sendKeys(reminderOptions.locale);

    const firstlocaleInFilteredList = await helpers.getElement(By.css(".r-dropdown-item"));
    await firstlocaleInFilteredList.click();

    await helpers.sleep(20);

    const emailTemplateSelectorContainer = await helpers.getElementWithinElement(restructureDrawer, By.css("[data-test-id='email-templates-selector']"));
    const emailTemplateSelectorButton = await helpers.getElementWithinElement(emailTemplateSelectorContainer, By.css(".button"));
    await emailTemplateSelectorButton.click();

    const searchEmailTemplateInput = await helpers.getElement(By.css(".search-input .input"));
    await searchEmailTemplateInput.sendKeys(reminderOptions.emailTemplate);
    const firstEmailTemplateInFilteredList = await helpers.getElement(By.css(".r-dropdown-item"));
    await firstEmailTemplateInFilteredList.click();

    await helpers.sleep(20);

    if (reminderOptions.scheduleType !== "NOW") {
      const specificCommunicationTimeRadioButton = await helpers.getElementWithinElement(
        restructureDrawer,
        By.css("[data-test-id='time-option-specific-communication-time']")
      );
      await specificCommunicationTimeRadioButton.click();

      if (reminderOptions.days) {
        const daysOptionsSelector = await helpers.getElementWithinElement(restructureDrawer, By.css("[data-test-id='email-scheduler-selector']"));
        await daysOptionsSelector.click();

        const daysBeforeDueDateOption = await helpers.getElement(By.css("[data-test-id='Set_number_of_days_before_every_due_date_1']"));
        await daysBeforeDueDateOption.click();

        const numberCounterContainer = await helpers.getElementWithinElement(restructureDrawer, By.css(".number-counter-container"));
        const plusButtonContainer = await helpers.getElementWithinElement(numberCounterContainer, By.css(".plus"));
        const plusButton = await helpers.getElementWithinElement(plusButtonContainer, By.css("button.button"));
        for (let i = 1; i < reminderOptions.days; i++) {
          await plusButton.click();
        }
      }
    }

    const confirmRestructureButton = await helpers.getElementWithinElement(restructureDrawer, By.css("button.confirm.is-primary"));
    await confirmRestructureButton.click();

    await helpers.sleep(20);
  }

  public async GetRestructureRemindersFieldValues(): Promise<{
    locale: string;
    emailTemplate: string;
    scheduleType: AccountRestructuringNotificationSchedule["type"];
    days?: number;
  }> {
    const restructureDrawer = await helpers.getElement(By.className("drawer-body"));
    const locale = await (await helpers.getElementWithinElement(restructureDrawer, By.css("[data-test-id='locale-selector']"))).getText();
    const emailTemplate = await (await helpers.getElementWithinElement(restructureDrawer, By.css("[data-test-id='email-templates-selector']"))).getText();

    let scheduleType: AccountRestructuringNotificationSchedule["type"];
    let days: number | undefined;

    const timeOptionNowLabel = await helpers.getElementWithinElement(restructureDrawer, By.css("[data-test-id='time-option-now']"));
    const timeOptionNowRadioButton = await helpers.getElementWithinElement(timeOptionNowLabel, By.css("input[type='radio']"));
    const timeOptionNowRadioButtonChecked = await timeOptionNowRadioButton.getAttribute("checked");

    if (timeOptionNowRadioButtonChecked) {
      scheduleType = "NOW";
    } else {
      const timeOptionSpecificTimeLabel = await (
        await helpers.getElementWithinElement(restructureDrawer, By.css("[data-test-id='email-scheduler-selector']"))
      ).getText();

      scheduleType = timeOptionSpecificTimeLabel === "On due date" ? "ON_DUE_DATE" : "NUMBER_OF_DAYS_BEFORE_DUE_DATE";

      if (scheduleType === "NUMBER_OF_DAYS_BEFORE_DUE_DATE") {
        const daysValue = await (
          await helpers.getElementWithinElement(restructureDrawer, By.css("[data-test-id='email-scheduler-days-input']"))
        ).getAttribute("value");
        if (daysValue) {
          days = Number(daysValue);
        }
      }
    }

    return {
      locale,
      emailTemplate,
      scheduleType,
      days,
    };
  }

  public async GetRestructureRemindersOverviewText(): Promise<string> {
    const restructureNotificationOverview = await helpers.getElement(By.css(".instalments-reminder-email"));
    return restructureNotificationOverview.getText();
  }

  public async OpenRestructureRemindersDetails(): Promise<void> {
    const restructureNotificationOverview = await helpers.getElement(By.css(".instalments-reminder-email"));
    const detailsButton = await helpers.getElementWithinElement(restructureNotificationOverview, By.css("a.has-text-primary"));
    await detailsButton.click();
  }

  public async CloseRestructureRemindersDetails(): Promise<void> {
    const restructureDrawer = await helpers.getElement(By.className("drawer-body"));
    const cancelButton = await helpers.getElementWithinElement(restructureDrawer, By.css("button.cancel"));
    await cancelButton.click();
  }
}

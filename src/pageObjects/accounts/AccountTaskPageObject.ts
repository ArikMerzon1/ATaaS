import { injectable } from "tsyringe";
import { By } from "selenium-webdriver";
import { TaskTabSelect, TimePeriod } from "../../utils/Enums";
import Helpers from "../../utils/helpers";

@injectable()
export default class AccountTaskPageObject {
  public async clickFirstTask(): Promise<void> {
    const firstRowCheckBox = await Helpers.getElement(By.css("tbody .check"));
    await firstRowCheckBox.click();

    await Helpers.sleep(1);
  }

  public async selectOverDueFilter(): Promise<void> {
    const element = await Helpers.getElement(By.css(".control .button"));
    await element.click();
    await Helpers.sleep(1);
    await Helpers.waitForNetworkCallToFinish();
  }

  public async clickStartStart(): Promise<void> {
    const saveButton = await Helpers.getElement(By.css('[data-test-id="save"]'));
    await saveButton.click();
    await Helpers.sleep(0.3);
    await this.waitForStartTaskCallToFinish('[data-test-id="save"]');
    await Helpers.sleep(2);

    const workOnAllTaskButton = await Helpers.getElement(By.css('[data-test-id="confirmation-modal-proceed-button"]'));
    await workOnAllTaskButton.click();
    await Helpers.sleep(0.3);
    await this.waitForStartTaskCallToFinish('[data-test-id="save"]');

    await this.waitForTaskToLoad();
  }

  public async getTaskRemainingText(): Promise<string> {
    const element = await Helpers.getElement(By.css(".remaining-tasks span"));
    return element.getText();
  }

  private async waitForStartTaskCallToFinish(selector: string): Promise<void> {
    try {
      await Helpers.sleep(1);
      await Helpers.waitForText(By.css(`${selector}`), "Start tasks");
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  }

  private async waitForTaskToLoad(): Promise<void> {
    let isExist = false;
    const TIMEOUT = 60;
    let count = 0;

    async function waitForElemnentToAppear(): Promise<void> {
      while (!isExist && count < TIMEOUT) {
        isExist = await Helpers.checkIfElementExists(By.css(".agent-start-tasks"));
        await Helpers.sleep(1);
        count++;
      }
    }

    await waitForElemnentToAppear();
  }

  public async waitForTasksToLoad(): Promise<void> {
    await Helpers.sleep(1);
    await Helpers.waitForNetworkCallToFinish();
    await Helpers.sleep(1);
  }

  public async getTasksCount(): Promise<number> {
    const rows = await Helpers.getElements(By.css("tbody tr"));
    return rows.length;
  }

  async selectTab(selectTab: TaskTabSelect): Promise<void> {
    console.log("SelectTab");
    switch (selectTab) {
      case TaskTabSelect.ACCOUNT_QUEUE:
        break;
      case TaskTabSelect.WORKFLOW_ACTIVE_STEPS:
        break;
      default:
        throw Error(`Selected tab "${selectTab}" doesn't exists`);
    }
  }

  async selectTimePeriod(selectTime: TimePeriod): Promise<void> {
    console.log("SelectTimePeriod");

    const row = await Helpers.getElement(By.css(".field.column.order-due-container"));
    const buttons = await Helpers.getElementsWithinElement(row, By.css(".button.is-outlined"));

    for (const button of buttons) {
      const text = (await button.getText()).toLowerCase();
      if (text === selectTime.toLowerCase()) await button.click();
    }
  }
}

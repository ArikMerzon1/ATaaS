import { injectable } from "tsyringe";
import { By } from "selenium-webdriver";
import helpers from "../../utils/helpers";

@injectable()
export default class AccountTaskPageObject {
  public async clickFirstTask(): Promise<void> {
    const firstRowCheckBox = await helpers.getElement(By.css("tbody .check"));
    await firstRowCheckBox.click();

    await helpers.sleep(1);
  }

  public async selectOverDueFilter(): Promise<void> {
    const element = await helpers.getElement(By.css(".control .button"));
    await element.click();
    await helpers.sleep(1);
    await helpers.waitForNetworkCallToFinish();
  }

  public async clickStartStart(): Promise<void> {
    const saveButton = await helpers.getElement(By.css('[data-test-id="save"]'));
    await saveButton.click();
    await helpers.sleep(0.3);
    await this.waitForStartTaskCallToFinish('[data-test-id="save"]');
    await helpers.sleep(2);

    const workOnAllTaskButton = await helpers.getElement(By.css('[data-test-id="confirmation-modal-proceed-button"]'));
    await workOnAllTaskButton.click();
    await helpers.sleep(0.3);
    await this.waitForStartTaskCallToFinish('[data-test-id="save"]');

    await this.waitForTaskToLoad();
  }

  public async getTaskRemainingText(): Promise<string> {
    const element = await helpers.getElement(By.css(".remaining-tasks span"));
    return element.getText();
  }

  private async waitForStartTaskCallToFinish(selector: string): Promise<void> {
    try {
      await helpers.sleep(1);
      await helpers.waitForText(By.css(`${selector}`), "Start tasks");
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
        isExist = await helpers.checkIfElementExists(By.css(".agent-start-tasks"));
        await helpers.sleep(1);
        count++;
      }
    }

    await waitForElemnentToAppear();
  }

  public async waitForTasksToLoad(): Promise<void> {
    await helpers.sleep(1);
    await helpers.waitForNetworkCallToFinish();
    await helpers.sleep(1);
  }

  public async getTasksCount(): Promise<number> {
    const rows = await helpers.getElements(By.css("tbody tr"));
    return rows.length;
  }
}

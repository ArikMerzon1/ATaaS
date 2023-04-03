import { By } from "selenium-webdriver";

import helpers from "../../utils/helpers";

export default class ContentCreatorBase {
  async save(): Promise<void> {
    console.log("SaveButton");
    const saveButton = await helpers.getElement(By.css(`[data-test-id="save-btn"]`));
    await saveButton.click();
  }

  async revertChanges(): Promise<void> {
    console.log("RevertChangesButton");
    const saveButton = await helpers.getElement(By.css(`[data-test-id="revert-changes-btn"]`));
    await saveButton.click();
  }

  async backButton(): Promise<void> {
    console.log("BackButton");
    const backButton = await helpers.getElement(By.css(`[data-test-id="navigation-button-label"]`));
    await backButton.click();
  }
}

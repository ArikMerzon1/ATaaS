import { injectable } from "tsyringe";
import { By } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import ContentCreatorBase from "./ContentCreatorBase";

@injectable()
export default class EmailCreatorPageObject extends ContentCreatorBase {
  async setNameOfTheEmail(name: string): Promise<void> {
    console.log("SetNameOfTheEmail");
    const emailName = await helpers.getElement(By.css('[data-test-id="name-input"]'));
    await helpers.sendKeys(emailName, name);

    const continueButton = await helpers.getElement(By.css('[class="button is-primary"]'));
    await continueButton.click();
  }

  async setSubject(subject: string, previewText: string): Promise<void> {
    console.log("SetSubject");
    const subjectInput = await helpers.getElement(By.css('[data-test-id="subject-input"]'));
    await helpers.sendKeys(subjectInput, subject);

    await helpers.sleep(1);

    const previewInput = await helpers.getElement(By.css('[data-test-id="preview-input"]'));
    await helpers.sendKeys(previewInput, previewText);

    const continueButton = await helpers.getElement(By.css('[class="button is-primary"]'));
    await continueButton.click();
  }
}

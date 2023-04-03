import { autoInjectable, inject } from "tsyringe";
import { By, ThenableWebDriver, WebElement } from "selenium-webdriver";
import helpers from "../../../utils/helpers";
import { IAction } from "./IAction";

@autoInjectable()
export default class StrategyStepBasePo implements IAction {
  constructor(@inject("webDriver") readonly webDriver: ThenableWebDriver) {}

  async Continue(): Promise<void> {
    console.log("ContinueButton");
    const controls = await helpers.getElement(By.css(".controls"));
    const continueButton = await controls.findElements(By.css(".button"));
    await continueButton[0].click();
  }

  async DeleteAction(): Promise<void> {
    console.log("DeleteButton");
    const continueButton = await helpers.getElement(By.className(`button.is-danger.is-outlined`));
    await continueButton.click();
  }

  async Edit(): Promise<void> {
    console.log("EditButton");
    const continueButton = await helpers.getElement(By.className(`button.navigation-btn.is-primary.is-inverted.backward`));
    await continueButton.click();
  }

  async SelectDropdownList(item: WebElement): Promise<this> {
    console.log("Select Dropdown List");
    const continueButton = await helpers.getElementWithinElement(item, By.css(`.button.is-fullwidth.dropdown-button`), false, false, 5000);
    await continueButton.click();
    return this;
  }

  async SearchInList(searchString: string): Promise<this> {
    console.log("Search");
    const tooltip = await helpers.getElement(By.css(".tooltip.popover"), false, true, 5000);
    const input = await tooltip.findElement(By.className("input"));
    await input.clear();
    await input.sendKeys(searchString);

    const selectedContent = await helpers.getElement(By.className("r-dropdown-item"));
    console.log(`drop menu first item: ${await selectedContent.getText()}`);
    await selectedContent.click();
    await helpers.takeScreenshot("SearchInList");
    return this;
  }

  async SelectItemFromGivenList(list: WebElement, inputFieldSelector: By, itemSelector: By, searchString: string): Promise<this> {
    const input = await list.findElement(inputFieldSelector);
    await input.clear();
    await input.sendKeys(searchString);

    const selectedContent = await list.findElement(itemSelector);

    await selectedContent.click();

    await helpers.takeScreenshot("SearchInGivenList");

    return this;
  }

  async SetDescription(descriptionText: string): Promise<this> {
    console.log("Set Description");
    const description = await helpers.getElement(By.css(`[data-test-id="strategy-builder-localStep-description"] .input`), false);
    await helpers.sendKeys(description, descriptionText);
    return this;
  }

  async SetProperties(properties: string[]): Promise<this> {
    console.log("Set properties");
    return this;
  }

  async SelectItemFromLIst(selectableItem: string): Promise<this> {
    console.log("Select Item From LIst");

    const itemList = await helpers.getElements(By.css(`.r-dropdown-item`));

    for (const item of itemList) {
      if ((await item.getText()).toLowerCase() === selectableItem) {
        await item.click();
        // await this.webDriver.actions().doubleClick(item).perform();
        // await item.isSelected();
        // await this.webDriver.executeScript("arguments[0].click();", item);
      }
    }
    await helpers.takeScreenshot("SelectItemFromLIst");
    return this;
  }
}

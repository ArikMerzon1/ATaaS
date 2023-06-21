import { container, inject, injectable } from "tsyringe";
import { By, Key, ThenableWebDriver } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import { StrategyEditorPageObject } from "./StrategyEditorPageObject";
import StrategyCardPo from "./StrategyCardPo";
import { StrategyActions } from "../../utils/Enums";

@injectable()
export class StrategyBuilderPageObject {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async searchAndSelectForStrategyByName(strategyName: string): Promise<StrategyEditorPageObject> {
    console.log("SearchAndSelectForStrategyByName");
    const searchInput = await helpers.getElement(By.css(`[placeholder="Search..."]`));
    await searchInput.clear();
    await searchInput.sendKeys(strategyName);
    const contentPreview = await helpers.getElements(By.css(`[data-test-id="strategy-list-grid-card-view-item"]`));
    await contentPreview[0].click();
    return container.resolve(StrategyEditorPageObject);
  }

  async searchStrategyCardByName(strategyName: string): Promise<StrategyCardPo> {
    console.log("SearchStrategyCardByName");
    const searchInput = await helpers.getElement(By.css(`[placeholder="Search..."]`));
    await searchInput.clear();
    await searchInput.sendKeys(strategyName);
    const gridItems = await helpers.getElements(By.css(".card-item.grid-item.card-item--highlightable"));
    await helpers.sleep(1);
    await (await gridItems[0].findElement(By.className("trigger"))).click();
    return container.resolve(StrategyCardPo);
  }

  async createStrategy(strategyName: string): Promise<StrategyEditorPageObject> {
    console.log("CreateStrategy", strategyName);
    await this.strategyCreator();
    const nameField = await helpers.getElement(By.css(`[placeholder="Enter a name"]`));
    await nameField.clear();
    await nameField.sendKeys(strategyName);
    const continueButton = await helpers.getElement(By.css(".button.button.is-primary.ml-4.submit"));
    await continueButton.click();
    return container.resolve(StrategyEditorPageObject);
  }

  async createStrategyWithStep(strategyName: string): Promise<void> {
    const strategyEditor = await this.createStrategy(strategyName);

    await strategyEditor
      .SearchForAction(StrategyActions.ENABLE_REPLIES)
      .then((_) => _.DrugAndDropObjects())
      .then((_) => _.OpenProperties(StrategyActions.ENABLE_REPLIES, "node-2"))
      .then((_) => _.Continue());

    await (await strategyEditor.SaveStrategy()).BackToStrategyBuilder();
  }

  async strategyCreator(cancel = false): Promise<this> {
    console.log("StrategyCreator");
    await helpers.waitForElement(By.className("grid"), false, true, true, 8000);
    const createButton = await helpers.getElement(By.css('[data-test-id="strategy-list-input-edit"]'), false, true, true, 10000);
    await createButton.click();
    if (!cancel) return this;
    await helpers.sleep(1);
    const cancelButton = await helpers.getElement(By.css(".ml-auto .button"));
    await cancelButton.click();
    return this;
  }

  async SelectStrategy(): Promise<this> {
    console.log("StrategyCreator");
    const selectCategoryButton = await helpers.getElement(By.css(".button.filter-trigger.align-label-left"));
    await helpers.sleep(5);
    await selectCategoryButton.click();
    const categories = await helpers.getElements(By.css(".dropdown-multiselect__container"), false);
    for (const category of categories) {
      const categoryElement = await helpers.getElementWithinElement(category, By.css(".dropdown-multiselect__container__item"));
      console.log("categoryElement", categoryElement);
      const categoryButton = await helpers.getElementWithinElement(categoryElement, By.css("input[type='checkbox']"));
      console.log("categoryElement", categoryElement);
      await categoryButton.click();
    }
    return this;
  }

  async assignCategoriesToStrategies(): Promise<this> {
    console.log("StrategyAssignCategory");
    const categoryName = "Agent";

    const checkboxes = await helpers.getElements(By.css(".card-item.grid-item.card-item--highlightable"));

    let counter = 2;
    for (const box of checkboxes) {
      counter--;
      const checkbox = await helpers.getElementWithinElement(box, By.css('[type="checkbox"]'));
      await helpers.click(checkbox);
      if (counter === 0) break;
    }

    const headerActionsButton = await helpers.getElement(By.css('[data-test-id="actions-dropdown"] button[type="button"]'), false, false, false);
    await headerActionsButton.click();

    const headerActions = await helpers.getElement(By.css(".r-dropdown__content"), false, false, false);
    const headerActionsList = await helpers.getElementsWithinElement(headerActions, By.css(".r-dropdown-item"));
    const button = headerActionsList[0];
    await this.webDriver.actions().move({ origin: button }).click().perform();
    await helpers.sleep(1);

    const category = await helpers.getElement(By.css(".taginput-container.is-focusable"));
    await this.webDriver.executeScript('arguments[0].classList.add("is-focused")', category);
    const categoryInput = await helpers.getElement(By.css('[placeholder="Add a category"]'), false, false, false);
    await helpers.scrollToElement(categoryInput);
    await this.webDriver.actions().move({ origin: categoryInput }).click().perform();

    await helpers.sleep(1);
    const categoryInputNew = await helpers.getElement(By.css('.taginput-container.is-focusable input[type="text"]'), false, false, false);
    await categoryInputNew.click(); // Ensure the input field is focused
    await categoryInputNew.clear();
    await categoryInputNew.sendKeys(categoryName, Key.ENTER);
    await this.webDriver.actions().move({ origin: categoryInputNew }).click().perform();
    await this.webDriver.executeScript("arguments[0].focus();", categoryInputNew);
    await categoryInputNew.click();

    await this.webDriver.executeScript("arguments[0].blur();", categoryInput);
    const outsideElement = await helpers.getElement(By.css(".modal-card"), false, false, false);
    await this.webDriver.executeScript("arguments[0].focus();", outsideElement);
    await this.webDriver.actions().move({ origin: outsideElement }).click().perform();
    const saveChangesButton = await helpers.getElement(By.css(".ml-auto .button.button.is-primary.ml-4.is-primary"), false, false, false);
    await this.webDriver.executeScript("arguments[0].focus();", saveChangesButton);
    await this.webDriver.actions().move({ origin: saveChangesButton }).click().perform();
    await helpers.sleep(5);
    return this;
  }

  async deselectAllStrategies(): Promise<this> {
    console.log("StrategyAssignCategory");

    const checkboxes = await helpers.getElements(By.css(".card-item.grid-item.card-item--highlightable"));

    let counter = 4;
    for (const box of checkboxes) {
      counter--;
      const checkbox = await helpers.getElementWithinElement(box, By.css('[type="checkbox"]'));
      await helpers.click(checkbox);
      if (counter === 0) break;
    }

    const headerActionsButton = await helpers.getElement(By.css('[data-test-id="actions-dropdown"] button[type="button"]'), false, false, false);
    await headerActionsButton.click();

    const headerActions = await helpers.getElement(By.css(".r-dropdown__content"), false, false, false);
    const headerActionsList = await helpers.getElementsWithinElement(headerActions, By.css(".r-dropdown-item"), false, false, false);
    await headerActionsList[1].click();
    return this;
  }

  async filterStrategiesByCategory(): Promise<this> {
    console.log("StrategyCreator");
    await helpers.sleep(1);
    const selectCategoryButton = await helpers.getElement(By.css(".button.filter-trigger.align-label-left"), false, false);
    await selectCategoryButton.click();
    const group = await helpers.getElement(By.css(".dropdown-multiselect__container"));
    const categories = await helpers.getElementsWithinElement(group, By.css(".dropdown-multiselect__container__item"));

    const categoriesSlice = categories.slice(0, 2);

    for (const category of categoriesSlice) {
      const checkbox = await helpers.getElementWithinElement(category, By.css(`[type="checkbox"]`));
      await helpers.click(checkbox);
    }

    const action = await helpers.getElement(By.css(`div.dropdown-multiselect__actions button.dropdown-multiselect__actions__apply`));
    await this.webDriver.actions().move({ origin: action }).click().perform();
    await helpers.sleep(5);
    return this;
  }

  async editStrategyCategories(): Promise<this> {
    console.log("StrategyCreator");
    const categoryName = "Agent";
    await helpers.sleep(1);
    const builderActions = await helpers.getElement(By.css("[data-test-id='strategy-builder-header-headline-actions-button']"), false, false);
    await builderActions.click();

    const headerActions = await helpers.getElement(By.css(".r-dropdown__content"), false, false, false);
    const headerActionsList = await helpers.getElementsWithinElement(headerActions, By.css(".r-dropdown-item"));
    const button = headerActionsList[2];
    await this.webDriver.actions().move({ origin: button }).click().perform();
    await helpers.sleep(1);
    const categoryInput = await helpers.getElement(By.css('[placeholder="Add a category"]'), false, false, false);
    await helpers.scrollToElement(categoryInput);
    await this.webDriver.actions().move({ origin: categoryInput }).click().perform();

    await helpers.sleep(1);
    const categoryInputNew = await helpers.getElement(By.css('.taginput-container.is-focusable input[type="text"]'), false, false, false);
    await categoryInputNew.click(); // Ensure the input field is focused
    await categoryInputNew.clear();
    await categoryInputNew.sendKeys(categoryName, Key.ENTER);
    await this.webDriver.actions().move({ origin: categoryInputNew }).click().perform();
    await this.webDriver.executeScript("arguments[0].focus();", categoryInputNew);
    await categoryInputNew.click();

    await helpers.sleep(1);
    return this;
  }
}

export default { StrategyBuilder: StrategyBuilderPageObject };

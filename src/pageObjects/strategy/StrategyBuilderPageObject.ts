import { container, inject, injectable } from "tsyringe";
import { By, ThenableWebDriver } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import { StrategyEditorPageObject } from "./StrategyEditorPageObject";
import StrategyCardPo from "./StrategyCardPo";

@injectable()
export class StrategyBuilderPageObject {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async SearchAndSelectForStrategyByName(strategyName: string): Promise<StrategyEditorPageObject> {
    console.log("SearchAndSelectForStrategyByName");
    const searchInput = await helpers.getElement(By.css(`[placeholder="Search"]`));
    await searchInput.clear();
    await searchInput.sendKeys(strategyName);
    const contentPreview = await helpers.getElements(By.css(`[data-test-id="strategy-list-grid-card-view-item"]`));
    await contentPreview[0].click();
    return container.resolve(StrategyEditorPageObject);
  }

  async SearchStrategyCardByName(strategyName: string): Promise<StrategyCardPo> {
    console.log("SearchStrategyCardByName");
    const searchInput = await helpers.getElement(By.css(`[placeholder="Search"]`));
    await searchInput.clear();
    await searchInput.sendKeys(strategyName);
    const gridItems = await helpers.getElements(By.css(".card-item.grid-item.card-item--highlightable"));
    await helpers.sleep(1);
    await (await gridItems[0].findElement(By.className("trigger"))).click();
    return container.resolve(StrategyCardPo);
  }

  async CreateStrategy(strategyName: string): Promise<StrategyEditorPageObject> {
    console.log("CreateStrategy", strategyName);
    await helpers.waitForElement(By.className("grid"), false, true, 8000);
    const createButton = await helpers.getElement(By.css('[data-test-id="strategy-list-input-edit"]'), false, true, 10000);
    await createButton.click();

    const nameField = await helpers.getElement(By.css(`[placeholder="Enter a name"]`));
    await nameField.clear();
    await nameField.sendKeys(strategyName);
    const continueButton = await helpers.getElement(By.css(".button.button.is-primary.ml-4.submit"));
    await continueButton.click();
    return container.resolve(StrategyEditorPageObject);
  }
}

export default { StrategyBuilder: StrategyBuilderPageObject };

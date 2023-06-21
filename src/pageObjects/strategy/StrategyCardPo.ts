import { container, inject, injectable } from "tsyringe";
import { By, ThenableWebDriver } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import { StrategyEditorPageObject } from "./StrategyEditorPageObject";

@injectable()
export default class StrategyCardPo {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  private static async SelectButton(button: string): Promise<void> {
    const buttons = await helpers.getElements(By.css(".r-dropdown-item.actions__item"));
    console.log("Selected button", buttons);
    for (let i = 0; i < buttons.length; i++) {
      console.log(await buttons[i].getText());
      if ((await buttons[i].getText()) === button) {
        await buttons[i].click();
        break;
      }
    }
  }

  async EnableActionDropdown(): Promise<void> {
    const actionButtonsClass = "actions__item";
    const actionsDropdown = await helpers.getElement(By.css(`[data-test-id="strategy-list-grid-card-view-button"]`));

    if (!(await helpers.checkIfElementExists(By.className(actionButtonsClass)))) {
      await actionsDropdown.click();
    }
  }

  async Rename(strategyName: string): Promise<void> {
    console.log("Rename");
    await StrategyCardPo.SelectButton("Rename");

    const nameField = await helpers.getElement(By.css(`[placeholder="Enter a name"]`));
    await helpers.clearInputField(nameField);
    await nameField.sendKeys(strategyName);
    await helpers.takeScreenshot("rename");
    const continueButton = await helpers.getElement(By.css(".button.button.is-primary.ml-4.submit"));
    await continueButton.click();
  }

  async Clone(strategyName: string): Promise<StrategyEditorPageObject> {
    console.log("Clone");
    await StrategyCardPo.SelectButton("Clone");

    const nameField = await helpers.getElement(By.css(`[placeholder="Enter a name"]`));
    await nameField.sendKeys(strategyName);
    const continueButton = await helpers.getElement(By.css(".button.button.is-primary.ml-4.submit"));
    await continueButton.click();
    return container.resolve(StrategyEditorPageObject);
  }

  async Delete(): Promise<void> {
    console.log("Delete");
    await StrategyCardPo.SelectButton("Delete");
    const deleteButton = await helpers.getElement(By.css(".button.ml-4.is-danger"));
    await deleteButton.click();
  }
}

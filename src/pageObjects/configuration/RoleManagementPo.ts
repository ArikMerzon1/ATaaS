import { inject, injectable } from "tsyringe";
import { By, ThenableWebDriver, WebElement } from "selenium-webdriver";
import helpers from "../../utils/helpers";

@injectable()
export default class RoleManagementPo {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}
  permissionCardsMap = new Map<string, Map<string, WebElement>>();

  async getPermissionCards(): Promise<void> {
    console.log("getPermissionCards");

    try {
      await RoleManagementPo.openAllOptions();
      let cardMap = new Map<string, WebElement>();
      const permissionCards = await helpers.getElements(By.className("module-permission-card"), false);
      for (const card of permissionCards) {
        const cardKey = await (await helpers.getElementWithinElement(card, By.className("module-permission-card__title"))).getText();
        const cardToggle = await helpers.getElementsWithinElement(card, By.className("module-switch"));
        for (const radioButton of cardToggle) {
          const switchKey = await (await helpers.getElementWithinElement(radioButton, By.className("module-switch__label"))).getText();
          const switchButton = await helpers.getElementWithinElement(radioButton, By.css(".switch.module-switch__switch.is-rounded"));
          const ariaSelected = await switchButton.getAttribute("aria-selected");
          console.log(`Radio button name: ${switchKey}`);
          console.log(`Radio button value: ${ariaSelected}`);

          if (ariaSelected === "true") {
            console.log("Radio button clicked");
            await this.webDriver.executeScript("arguments[0].click();", switchButton);
          }
          cardMap.set(switchKey, switchButton);
        }

        this.permissionCardsMap.set(cardKey, cardMap);
        cardMap = new Map<string, WebElement>();
      }
      console.log(this.permissionCardsMap);
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }

  private static async openAllOptions(): Promise<void> {
    console.log("openAllOptions");
    const cardFooters = await helpers.getElements(By.className("module-permission-card__footer"));
    for (const footer of cardFooters) {
      await footer.click();
      await helpers.sleep(1);
    }
  }

  async setPermissions(roles: Map<string, string[]>): Promise<this> {
    console.log("setPermissions");
    for (const role of roles) {
      const view = await this.permissionCardsMap.get(role[0]);

      for (const item of role[1]) {
        const checkBox = await view?.get(item);
        await this.webDriver.executeScript("arguments[0].click();", checkBox);
      }
    }
    return this;
  }

  async saveChanges(): Promise<void> {
    console.log("saveChanges");
    const saveButton = await helpers.getElement(By.css(".button.role-editor__headline__save-btn.is-primary"));
    await saveButton.click();
  }
}

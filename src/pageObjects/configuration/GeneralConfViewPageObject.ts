import { injectable } from "tsyringe";
import { By, WebElement } from "selenium-webdriver";
import Helpers from "../../utils/helpers";
import { GeneralConfigurationCards } from "../../utils/Enums";

@injectable()
export default class GeneralConfViewPageObject {
  private async selectCards(selectCard: GeneralConfigurationCards): Promise<WebElement> {
    console.log("ReadCards");

    const cards = await Helpers.getElements(By.css(".card"));
    for (const card of cards) {
      const cardName = (await Helpers.getElementWithinElement(card, By.css(".section-description__text-group__title"))).getText();
      if ((await cardName).toLowerCase() === selectCard.toLowerCase()) return card;
    }

    throw Error(`Selected card: "${selectCard}" was not found`);
  }

  async getDataFromCard(card: GeneralConfigurationCards): Promise<void> {
    console.log("GetDataFromCard");
  }

  async editCard(card: GeneralConfigurationCards): Promise<void> {
    console.log("EditCard");
  }
}

import { By, Key, WebElement } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import { LandingPageView } from "../../utils/Enums";

export default class ContentBuildBase {
  protected async findContentByName(contentName: string): Promise<WebElement> {
    const searchInput = await helpers.getElement(By.className("input"));
    await searchInput.click();
    await searchInput.sendKeys(contentName);
    await searchInput.sendKeys(Key.ENTER);

    return helpers.getElement(By.css(".card-item.grid-item"));
  }

  async switchView(view: LandingPageView): Promise<void> {
    console.log("switchView");
    switch (view) {
      case LandingPageView.CardView:
        await helpers.getElement(By.css(`.button.card-btn`)).then((_) => _.click());
        break;
      case LandingPageView.ListView:
        await helpers.getElement(By.css(`.button.list-btn`)).then((_) => _.click());
        break;
      default:
        console.error(`not supported view selected: ${view}`);
    }
  }
}

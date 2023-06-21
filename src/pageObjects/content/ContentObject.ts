import { container, injectable, InjectionToken } from "tsyringe";
import { By } from "selenium-webdriver";
import { ContentObjectMenu } from "../../utils/Enums";
import Helpers from "../../utils/helpers";

@injectable()
export default class ContentObject {
  // https://stackoverflow.com/questions/64121881/using-a-type-as-a-parameter-typescript
  async selectFromMenu<T extends InjectionToken>(selection: ContentObjectMenu, type: T): Promise<void> {
    switch (selection) {
      case ContentObjectMenu.EDIT:
        await this.edit(type);
        break;
      case ContentObjectMenu.CLONE:
        await this.clone(type);
        break;
      case ContentObjectMenu.DELETE:
        await this.delete(type);
        break;
      default:
        throw Error(`Selected ContentObject: "${selection}" doesn't exists`);
    }
  }
  private async edit<T extends InjectionToken>(type: T): Promise<unknown> {
    console.log("Edit");
    await (await Helpers.getElement(By.css(`[data-test-id="bundle-edit"]`))).click();
    return container.resolve(type);
  }
  private async clone<T extends InjectionToken>(type: T): Promise<unknown> {
    console.log("Clone");
    await (await Helpers.getElement(By.css(`[data-test-id="bundle-clone"]`))).click();
    return container.resolve(type);
  }
  private async delete<T extends InjectionToken>(type: T): Promise<unknown> {
    console.log("Delete");
    await (await Helpers.getElement(By.css(`[data-test-id="bundle-delete"]`))).click();
    return container.resolve(type);
  }
}

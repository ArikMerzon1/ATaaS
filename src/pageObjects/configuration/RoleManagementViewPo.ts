import { container, inject, injectable } from "tsyringe";
import { By, ThenableWebDriver } from "selenium-webdriver";
import helpers from "../../utils/helpers";
import { UserRoleBackoffice } from "../../utils/Enums";
import RoleManagementPo from "./RoleManagementPo";

@injectable()
export default class RoleManagementViewPo {
  constructor(@inject("webDriver") private readonly webDriver: ThenableWebDriver) {}

  async selectRole(role: UserRoleBackoffice): Promise<RoleManagementPo> {
    console.log("selectRole");
    const roleNames = await helpers.getElements(By.css(`[data-label="Name"]`));
    for (let i = 0; i < roleNames.length; i++) {
      if ((await roleNames[i].getText()) === role) {
        await roleNames[i].click();
        await helpers.waitForText(By.className("role-editor__headline__title"), role);
        return container.resolve(RoleManagementPo);
      }
    }
    throw Error("Role was not found");
  }

  private static async getRole(role: UserRoleBackoffice): Promise<number> {
    console.log("getRole");
    const roleNames = await helpers.getElements(By.css(`[data-label="Name"]`));
    for (let i = 0; i < roleNames.length; i++) {
      if ((await roleNames[i].getText()) === role) {
        return i;
      }
    }
    throw Error("Role was not found");
  }

  async getModels(role: UserRoleBackoffice): Promise<string[]> {
    console.log("getModels");
    const models = await helpers.getElements(By.css(`[data-label="Modules"]`));
    const modelsList: string[] = [];
    const roleLocation = await RoleManagementViewPo.getRole(role);
    await (await models[roleLocation].getText()).split(" ,").forEach((item) => modelsList.push(item));
    return modelsList;
  }
}

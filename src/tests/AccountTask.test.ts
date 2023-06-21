import "reflect-metadata";
import { suite, test, timeout } from "@testdeck/jest";
import assert from "assert";

import { SidebarMenuEnum, AccountsSubMenu } from "../utils/Enums";
import AbstractTestBase from "./AbstractTestBase";
import AccountTaskPageObject from "../pageObjects/accounts/AccountTaskPageObject";

@suite("AccountTaskTests")
class AccountTaskTests extends AbstractTestBase {
  @test("AccountTaskTest:Start Selected Tasks")
  @timeout(AbstractTestBase.timeOut)
  async startSelectedTasks(): Promise<void> {
    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login();
    const tasksObject: AccountTaskPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.ACCOUNT)
    ).SelectFromSubMenu(AccountsSubMenu.TASKS);

    await tasksObject.waitForTasksToLoad();

    await tasksObject.selectOverDueFilter();

    const tasksCount = await tasksObject.getTasksCount();

    if (tasksCount > 0) {
      await tasksObject.clickFirstTask();

      await tasksObject.clickStartStart();

      const text = await tasksObject.getTaskRemainingText();

      const EXPECTED_TEXT = "You have 1 tasks remaining";

      assert.strictEqual(text, EXPECTED_TEXT);
    }
  }
}

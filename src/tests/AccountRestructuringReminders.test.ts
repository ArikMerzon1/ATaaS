import "reflect-metadata";
import { suite, test, timeout } from "@testdeck/jest";
import { ClaimWithStatus } from "@receeve-gmbh/account-api/ClaimDTO";
import { AccountRestructuringNotificationSchedule } from "@receeve-gmbh/account-api/AccountRestructuringNotificationSchedule";

import { SidebarMenuEnum, AccountsSubMenu } from "../utils/Enums";
import AbstractTestBase from "./AbstractTestBase";
import Helpers from "../utils/helpers";
import AccountOverviewPageObject from "../pageObjects/accounts/AccountsOverviewPageObject";

@suite("AccountRestructuringReminders")
class AccountRestructuringRemindersTests extends AbstractTestBase {
  @test("RequestRestructureWithReminders")
  @timeout(AbstractTestBase.timeOut)
  async strategyBuilderWithIfConditionTest(): Promise<void> {
    const { accountId, claims } = await this.createAccount();

    const backOffice = await this.withWebDriver();
    await backOffice.LoginPage().Login();

    const sidebar = await backOffice.SidebarMenu().SelectTab(SidebarMenuEnum.ACCOUNT);
    const accountManagementPage: AccountOverviewPageObject = await sidebar.SelectFromSubMenu(AccountsSubMenu.accountManagement);
    await Helpers.sleep(15);

    await accountManagementPage.SearchAccount(accountId);
    const accountPageObject = await accountManagementPage.SelectFirstAccount();
    await Helpers.sleep(15);

    const restructuringRemindersOptions: {
      locale: string;
      emailTemplate: string;
      scheduleType: AccountRestructuringNotificationSchedule["type"];
      days?: number;
    } = {
      locale: "Spanish (Spain)",
      emailTemplate: "ATaas - Email Template",
      scheduleType: "NUMBER_OF_DAYS_BEFORE_DUE_DATE",
      days: 3,
    };

    await accountPageObject.RestructureAccount(restructuringRemindersOptions);

    const restructureRemindersOverviewText = await accountPageObject.GetRestructureRemindersOverviewText();
    expect(restructureRemindersOverviewText).toContain("Reminder email enabled");
    expect(restructureRemindersOverviewText).toContain(`Send ${restructuringRemindersOptions.days} days before every due date`);

    await accountPageObject.OpenRestructureRemindersDetails();
    const restructureReminderFieldValues = await accountPageObject.GetRestructureRemindersFieldValues();
    await accountPageObject.CloseRestructureRemindersDetails();

    await this.deleteClaims(accountId, claims);

    const { locale, emailTemplate, scheduleType, days } = restructureReminderFieldValues;
    expect(locale).toContain(restructuringRemindersOptions.locale);
    expect(emailTemplate).toContain(restructuringRemindersOptions.emailTemplate);
    expect(scheduleType).toContain(restructuringRemindersOptions.scheduleType);
    expect(days).toBe(restructuringRemindersOptions.days);
  }

  private async createAccount(): Promise<{ accountId: string; claims: ClaimWithStatus[] }> {
    const accountId = await this.withRestClient().accountQueries.createAccounts({
      ledgerEntries: [
        {
          ledgerEntryReference: "invoice_001",
          invoiceDetails: {
            amount: 10000,
            dueDate: "2022-10-21",
          },
          context: {},
        },
        {
          ledgerEntryReference: "invoice_002",
          invoiceDetails: {
            amount: 12000,
            dueDate: "2022-12-23",
          },
          context: {},
        },
      ],
    });

    await Helpers.sleep(5);

    const claims = await this.withRestClient().accountQueries.getAccountClaims(accountId);
    expect(claims?.length).toBe(2);

    return { accountId, claims };
  }

  private async deleteClaims(accountId: string, claims: ClaimWithStatus[]): Promise<void> {
    await Promise.all(
      claims.map(async (claim) => {
        await this.withRestClient().ledgerEntriesQueries.deleteAccountLedgerEntries(accountId, claim.externalClaimRef);
      })
    );
  }
}

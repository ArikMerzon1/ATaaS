import { container, inject, injectable } from "tsyringe";
import dummyJson from "dummy-json";
import { HttpProvider } from "../utils/httpProvider";
import Helpers from "../utils/helpers";
import ProductsQueries from "./ProductsQueries";
import { IDueDate } from "./IDueDate";

@injectable()
export default class LedgerEntriesQueries {
  constructor(@inject(HttpProvider) private readonly httpProvider: HttpProvider) {}

  /**
   * Add Account Ledger Entries
   * @see https://exness.atlassian.net/wiki/spaces/TEC/pages/164200797/Account+Level+Collections
   * */
  async addAccountLedgerEntries(accountReference: string, ledgerEntryReference: string, amount: number, dueDate: IDueDate): Promise<string> {
    console.log("addAccountLedgerEntries");
    const productQueries = container.resolve(ProductsQueries);
    const productId = await productQueries.addAccountProduct(accountReference);

    const bodyFormat = [
      {
        accountReference,
        ledgerEntryReference,
        invoiceDetails: {
          amount,
          createdAt: new Date().valueOf(),
          dueDate: `${dueDate.year}-${dueDate.month}-${dueDate.day}`,
          paymentReference: "PaymentReference_New",
          meta: { isFromAutomation: true },
        },
        context: {
          productReference: `${productId}`,
        },
      },
    ];

    const body = dummyJson.parse(JSON.stringify(bodyFormat));
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/add_account_ledger_entries`, body);
    return JSON.stringify(result.data);
  }

  /**
   * Delete the Ledger Entry
   * @see https://exness.atlassian.net/wiki/spaces/TEC/pages/541687818/Delete+Claims+from+Ledger+Entries

   * */
  async deleteAccountLedgerEntries(accountReference: string, ledgerEntryReference: string): Promise<string> {
    console.log("deleteInvoiceAccountLedgerEntries");

    const bodyFormat = [
      {
        accountReference,
        ledgerEntries: [
          {
            meta: {},
            amount: 0,
            ledgerEntryReference,
            reason: "DELETE_LEDGER_ENTRY",
          },
        ],
      },
    ];

    const body = dummyJson.parse(JSON.stringify(bodyFormat));
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/update_account_ledger_entries_amounts`, body);
    return JSON.stringify(result.data);
  }
}

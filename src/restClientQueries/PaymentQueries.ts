import { inject, injectable } from "tsyringe";
import dummyJson from "dummy-json";
import { HttpProvider } from "../utils/httpProvider";
import Helpers from "../utils/helpers";
import { IDueDate } from "./IDueDate";
import { CurrencyEnum } from "../utils/Enums";

@injectable()
export default class PaymentQueries {
  constructor(@inject(HttpProvider) private readonly httpProvider: HttpProvider) {}

  async matchAccountPayment(accountReference?: string, amount?: number, body?: unknown): Promise<string> {
    let bodyFormat: string;
    if (!body) {
      const defaultBody = {
        accountReference: `${accountReference}`,
        currency: "EUR",
        matchStrategy: "ORDERED_INVOICES_WITH_FEES_THEN_ACCOUNT_ENTRIES",
        totalAmount: amount,
        providerName: "trustly",
        trackingId: "occaecat dolore officia ut",
        paymentReference: "CLM-12345",
        meta: {},
      };
      bodyFormat = dummyJson.parse(JSON.stringify(defaultBody));
    } else bodyFormat = dummyJson.parse(JSON.stringify(body));

    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/match_account_payment`, bodyFormat);
    return JSON.stringify(result.data);
  }

  async updateAccountLedgerEntriesAmounts(accountReference: string, amount: number, ledgerEntryReference: string): Promise<string> {
    const bodyFormat = [
      {
        accountReference: `${accountReference}`,
        ledgerEntries: [
          {
            ledgerEntryReference: `${ledgerEntryReference}`,
            amount,
            reason: "PAYMENT",
            meta: {},
          },
        ],
      },
    ];

    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/match_account_payment`, JSON.stringify(bodyFormat));
    return JSON.stringify(result.data);
  }

  async createPromisesToPay(amount: number, currency: CurrencyEnum, dueDate: IDueDate): Promise<string> {
    const inputBody = {
      property: {
        amount,
        currency: `${currency}`,
        dueDate: `${dueDate.year}-${dueDate.month}-${dueDate.day}`,
      },
    };

    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/create_promises_to_pay`, JSON.stringify(inputBody));
    return JSON.stringify(result.data);
  }
}

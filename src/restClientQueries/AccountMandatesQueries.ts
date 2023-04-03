import { inject, injectable } from "tsyringe";
import dummyJson from "dummy-json";
import { CurrencyEnum } from "../utils/Enums";
import { IDueDate } from "./IDueDate";
import Helpers from "../utils/helpers";
import { HttpProvider } from "../utils/httpProvider";
import IRecurringPaymentMandateDAO from "../dao/IRecurringPaymentMandateDAO";

@injectable()
export default class AccountMandatesQueries {
  constructor(@inject(HttpProvider) private readonly httpProvider: HttpProvider) {}

  async createAccountMandates(recurringPaymentMandateDAO: IRecurringPaymentMandateDAO): Promise<string> {
    const inputBody = [
      {
        mandateId: "{{guid}}",
        accountReference: recurringPaymentMandateDAO,
        providerName: "ferratumCheckoutCreditCardV2",
        debtorReference: "string",
        productReferences: ["string"],
        mandateRepresentation: {
          holderName: "string",
          bankName: "string",
          accountNumber: "string",
        },
      },
    ];

    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/create_account_mandates`, dummyJson.parse(JSON.stringify(inputBody)));
    return JSON.stringify(result.data);
  }

  async deleteAccountMandates(amount: number, currency: CurrencyEnum, dueDate: IDueDate): Promise<string> {
    const inputBody = {
      property: {
        amount,
        currency: `${currency}`,
        dueDate: `${dueDate.year}-${dueDate.month}-${dueDate.day}`,
      },
    };

    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/delete_account_mandates`, JSON.stringify(inputBody));
    return JSON.stringify(result.data);
  }

  async getAccountMandates(amount: number, currency: CurrencyEnum, dueDate: IDueDate): Promise<string> {
    const inputBody = {
      property: {
        amount,
        currency: `${currency}`,
        dueDate: `${dueDate.year}-${dueDate.month}-${dueDate.day}`,
      },
    };

    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/get_account_mandates`, JSON.stringify(inputBody));
    return JSON.stringify(result.data);
  }
}

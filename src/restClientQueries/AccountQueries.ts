import dummyJson from "dummy-json";
import { inject, injectable } from "tsyringe";
import { ClaimWithStatus } from "@receeve-gmbh/account-api/ClaimDTO";

import Helpers from "../utils/helpers";
import { HttpProvider } from "../utils/httpProvider";

// TODO: Create API Request Types
type ClientAPIType = { [key: string]: unknown };

function getCreateAccount(patch?: Partial<ClientAPIType>): Record<string, ClientAPIType> {
  return {
    "AUT_{{guid}}": {
      paymentReference: "PaymentReference_New",
      currency: "USD",
      scores: [
        {
          type: "INTERNAL",
          value: "V1",
          meta: {
            isFromAutomation: true,
          },
        },
      ],
      debtors: [
        {
          birthday: "1980-06-21",
          lastName: "{{lastName}}",
          firstName: "{{firstName}}",
          type: "natural",
          companyName: "My First Company",
          SSN: "332GTFRD001",
          debtorReference: "DebtorReference_{{guid}}",
          portfolioReference: "TestClient_1",
          contactInformation: {
            country: "US",
            city: "Chicago",
            state: "Illinois",
            mobileNumber: "+4915731102793",
            postalCode: "60552",
            addressLine1: "38881 N West Park Ave Lake Villa, Illinois(IL)",
            addressLine2: "389 Holiday Dr Somonauk, Illinois(IL)",
            addressLine3: "addressLine3",
            landLine: "+4915731102794",
            email: "{{email}}",
          },
        },
      ],
      meta: {
        isFromAutomation: true,
      },
      ...patch,
    },
  };
}

@injectable()
export default class AccountQueries {
  constructor(@inject(HttpProvider) private readonly httpProvider: HttpProvider) {}

  async getAccountClaims(accountReference: string): Promise<ClaimWithStatus[]> {
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.get(`${clientId}/get_account_claims?accountReference=${accountReference}`);
    return result.data;
  }

  async createAccounts(patch?: Partial<ClientAPIType>): Promise<string> {
    try {
      console.log("createAccounts");

      const bodyFormat = dummyJson.parse(JSON.stringify(getCreateAccount(patch)));
      const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
      const result = await this.httpProvider.post(`${clientId}/create_accounts`, bodyFormat);
      const key = Object.keys(result.data)[0];
      if (result.data[key].success) {
        return result.data[key].messages[0].split(" ")[3];
      }
      throw new Error(result.data[key].messages[0]);
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  async restructureAccountOverdueInvoices(): Promise<string> {
    try {
      console.log("restructureAccountOverdueInvoices");

      const bodyFormat = {
        "{{guid}}": {
          amounts: [1],
          frequency: {
            days: 1,
            weeks: 1,
            months: 1,
          },
          initialDueDate: "2019-06-28",
        },
      };

      const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
      const result = await this.httpProvider.post(`${clientId}/restructure_account_overdue_invoices`, dummyJson.parse(JSON.stringify(bodyFormat)));
      return JSON.stringify(result.data);
    } catch (e) {
      throw Error(e).stack;
    }
  }
}

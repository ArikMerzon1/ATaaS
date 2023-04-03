import { inject, injectable } from "tsyringe";
import dummyJson from "dummy-json";
import { Claim, Debtor } from "@exness/account-api/Claim";
import { HttpProvider } from "../utils/httpProvider";
import Helpers from "../utils/helpers";

@injectable()
export default class ClaimQueries {
  constructor(@inject(HttpProvider) private readonly httpProvider: HttpProvider) {}

  async createClaim(): Promise<Response> {
    const body = {
      "AUT_{{guid}}": {
        amount: 5050,
        currency: "EUR",
        currentDueDate: "2021-10-15",
        originalDueDate: "2021-09-09",
        productReference: "PRODUCT_REFERENCE_{{guid}}",
        accountReference: "ACCOUNT_REFERENCE_{{guid}}",
        portfolioReference: "EXTERNAL_PORTFOLIO_REFERENCE_{{guid}}",
        totalFees: 140,
        primaryDebtor: {
          debtorReference: "EXTERNAL_DEBTOR_REF_{{guid}}",
          firstName: "{{firstName}}",
          lastName: "{{lastName}}",
          contactInformation: {
            email: "{{email}}",
            country: "DE",
          },
        },
        meta: {
          claimMeta1: "value1",
        },
      },
    };

    const bodyFormat = dummyJson.parse(JSON.stringify(body));
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/create_claims`, bodyFormat);
    const key = Object.keys(result.data)[0];
    if (result.data[key].success) {
      return JSON.parse(JSON.stringify(result.data[key])) as Response;
    }
    throw new Error(result.data[key].messages[0]);
  }

  async pauseJourneys(claimId: string): Promise<string> {
    const body = {
      ref: `${claimId}`,
    };

    const bodyFormat = dummyJson.parse(JSON.stringify(body));
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/pause_journeys`, bodyFormat);
    return JSON.stringify(result.data);
  }

  async resumeJourneys(claimId: string): Promise<string> {
    const body = {
      ref: `${claimId}`,
    };

    const bodyFormat = dummyJson.parse(JSON.stringify(body));
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/resume_journeys`, bodyFormat);
    return JSON.stringify(result.data);
  }

  async stopJourneys(claimId: string): Promise<string> {
    const body = {
      ref: `${claimId}`,
      reason: "CLAIM_DISCARDED",
      description: "Direct bank transfer received",
    };

    const bodyFormat = dummyJson.parse(JSON.stringify(body));
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/stop_journeys`, bodyFormat);
    return JSON.stringify(result.data);
  }

  async resolveClaims(claimId: string): Promise<string> {
    const body = [
      {
        ref: `${claimId}`,
        reason: "CLAIM_PAID",
      },
    ];

    const bodyFormat = dummyJson.parse(JSON.stringify(body));
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/resolve_claims`, bodyFormat);
    return JSON.stringify(result.data);
  }

  async updateClaim(claimId: string, body: string): Promise<string> {
    console.log("updateClaim");

    // const exampleBody = {
    //   property1: {
    //     amount: 500,
    //     currency: "EUR",
    //     portfolioReference: "yourPortfolioReference1",
    //     productReference: "string",
    //     totalFees: 9727,
    //     originalDueDate: "2021-05-28",
    //     currentDueDate: "2022-06-28",
    //     paymentReference: "yourPaymentReference1",
    //     accountNumber: "3adf43a5-64bf-54e8-8b33-fdea13262246",
    //     accountReference: "3adf43a5-64bf-54e8-8b33-fdea13262246",
    //     meta: {},
    //     fees: [
    //       {
    //         name: "Interest",
    //         amount: 120,
    //       },
    //     ],
    //     primaryDebtor: {
    //       birthday: "1980-06-28",
    //       gender: "M",
    //       firstName: "John",
    //       lastName: "White",
    //       middleName: "Benedict",
    //       title: "Doctor",
    //       companyName: "Acme Brick Co.",
    //       debtorReference: "string",
    //       contactInformation: {
    //         country: "DE",
    //         city: "Delbrück",
    //         mobileNumber: 495555555555,
    //         postalCode: 33129,
    //         addressLine1: "Boikweg 24",
    //         addressLine2: "c/o Acme",
    //         addressLine3: "additional information",
    //         landLine: 495555555555,
    //         state: "Dortmund",
    //         email: "testEmail@example.com",
    //       },
    //     },
    //   },
    // };

    let bodyFormat = dummyJson.parse(body);
    bodyFormat = bodyFormat.replace("property1", claimId);
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.post(`${clientId}/update_claims`, bodyFormat);
    const key = Object.keys(result.data)[0];
    if (result.data[key].success) return JSON.stringify(result.data);
    throw new Error(result.data[key].messages[0]);
  }

  async getAccountClaims(claimId: string): Promise<string> {
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.get(`${clientId}/get_account_claims?accountReference=${claimId}`);
    return JSON.stringify(result.data);
  }
}

export interface Response {
  success: boolean;
  messages: string[];
  data: ResponseClaim;
}

export interface ResponseClaim extends Claim {
  primaryDebtor: Debtor;
}

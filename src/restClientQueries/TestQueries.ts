import { inject, injectable } from "tsyringe";
import assert from "assert";
import Helpers from "../utils/helpers";
import { HttpProvider } from "../utils/httpProvider";

@injectable()
export default class TestQueries {
  constructor(@inject(HttpProvider) private readonly httpProvider: HttpProvider) {}

  async getWithoutOauthTokenTest(account: string): Promise<void> {
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = (await this.httpProvider.get(`${clientId}/get_account?accountReference=${account}`, true, true)) as unknown as Result;
    if (result.response.statusText !== "Unauthorized" || !result.message.includes("Request failed with status code 401")) {
      assert.fail("FAIL");
    } else {
      console.log(`Test PASS --> ${result.response.statusText}`);
    }
  }

  async getAccountDataWithDifferentAccountID(accountID: string, account: string): Promise<void> {
    const result = (await this.httpProvider.get(`${accountID}/get_account?accountReference=${account}`, true)) as unknown as Result;
    if (
      result.response.statusText !== "Forbidden" ||
      !result.response.data.Message.includes("User is not authorized to access this resource with an explicit deny")
    ) {
      assert.fail("FAIL");
    } else {
      console.log(`Test PASS --> ${result.response.statusText}`);
    }
  }
}

export interface Result {
  config: object;
  request: object;
  response: MyResponse;
  isAxiosError: boolean;
  message: string;
}

export interface MyResponse {
  status: number;
  statusText: string;
  data: { Message: string };
}

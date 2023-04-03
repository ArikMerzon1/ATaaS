import { inject, injectable } from "tsyringe";
import { HttpProvider } from "../utils/httpProvider";
import Helpers from "../utils/helpers";

@injectable()
export default class LandingPageQueries {
  constructor(@inject(HttpProvider) private readonly httpProvider: HttpProvider) {}

  async getLandingPage(claimId: string): Promise<string> {
    const clientId = Helpers.getValue(process.env.TEST_CLIENT_ID);
    const result = await this.httpProvider.get(`${clientId}/get_landing_page_url?claimReference=${claimId}`);
    return JSON.stringify(result.data);
  }
}

import { AuthOptions } from "aws-appsync-auth-link";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Helpers from "./helpers";

async function getJwtToken(): Promise<string> {
  const baseUtl = Helpers.getValue(process.env.BASE_REST_API) as string;

  const axiosRequest: AxiosRequestConfig = {
    method: "post",
    url: `${baseUtl}/oauth2/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: Helpers.getValue(process.env.AUTH) as string,
    },
  };

  return axios(axiosRequest)
    .then((response: AxiosResponse) => {
      console.log(`accessToken: ${JSON.stringify(response.data)}`);
      return response.data.access_token;
    })
    .catch((error) => {
      console.log(error);
    });
}
export class GraphqlProvider {
  private readonly graphqlEndpointPrefix = process.env.BACKOFFICE_BASE_URL;
  public readonly graphqlEndpoints: Record<string, string> = {
    acceptanceTesting: `${this.graphqlEndpointPrefix}/acceptance-testing-api`,
    account: `${this.graphqlEndpointPrefix}/account-api`,
    backoffice: `${this.graphqlEndpointPrefix}/backoffice-api`,
    cms: `${this.graphqlEndpointPrefix}/cms-api`,
    decisions: `${this.graphqlEndpointPrefix}/decision-api`,
    events: `${this.graphqlEndpointPrefix}/events-api`,
    files: `${this.graphqlEndpointPrefix}/files-api`,
    finance: `${this.graphqlEndpointPrefix}/finance-api`,
    landingPage: `${this.graphqlEndpointPrefix}/landing-page-api`,
    layout: `${this.graphqlEndpointPrefix}/layout-api`,
    messageLogger: `${this.graphqlEndpointPrefix}/message-logger-api`,
    mocks: `${this.graphqlEndpointPrefix}/mocks-api`,
    note: `${this.graphqlEndpointPrefix}/notes-api`,
    notifications: `${this.graphqlEndpointPrefix}/notifications-api`,
    operations: `${this.graphqlEndpointPrefix}/operations-api`,
    partner: `${this.graphqlEndpointPrefix}/partner-api`,
    reactions: `${this.graphqlEndpointPrefix}/reactions-api`,
    reporting: `${this.graphqlEndpointPrefix}/reporting-api`,
    simulation: `${this.graphqlEndpointPrefix}/simulation-api`,
    strategy: `${this.graphqlEndpointPrefix}/strategy-api`,
    webhookSusbscriptions: `${this.graphqlEndpointPrefix}/webhook-subscription-api`,
    workflows: `${this.graphqlEndpointPrefix}/workflows-api`,
  };

  public readonly websocketEndpoints = {
    backoffice: process.env.VUE_APP_BACKOFFICE_APPSYNC_URL,
    messageLogger: process.env.VUE_APP_MESSAGE_LOGGER_APPSYNC_URL,
    simulation: process.env.VUE_APP_SIMULATION_BACKOFFICE_APPSYNC_URL,
    eventMessages: process.env.VUE_APP_EVENT_MESSAGES_APPSYNC_URL,
    acceptanceTesting: process.env.VUE_APP_ACCEPTANCE_TESTING_APPSYNC_URL,
  };

  public getAuthOptions(): AuthOptions {
    return {
      type: "AMAZON_COGNITO_USER_POOLS",
      jwtToken: getJwtToken,
    };
  }

  public getRegion(): string {
    return process.env.AWS_REGION || "";
  }
}

export default new GraphqlProvider();

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject, split } from "@apollo/client/core";
import { createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import fetch from "cross-fetch";
import graphqlProvider from "./graphqlProvider";

function getApolloClientForUrl(url: string): ApolloClient<NormalizedCacheObject> {
  try {
    const httpLink2 = new HttpLink({ uri: url, fetch });
    const authToken = graphqlProvider.getAuthOptions();
    const awsRegion = graphqlProvider.getRegion();

    return new ApolloClient({
      cache: new InMemoryCache({ addTypename: false }),
      link: ApolloLink.from([
        createAuthLink({
          url,
          region: awsRegion,
          auth: authToken,
        }),
        split(
          (op) => {
            const { operation } = op.query.definitions[0] as { operation: string };

            return operation !== "subscription";
          },
          httpLink2,
          createSubscriptionHandshakeLink(
            {
              url,
              region: awsRegion,
              auth: authToken,
            },
            httpLink2
          )
        ),
      ]),
    });
  } catch (error) {
    throw Error(JSON.stringify(error, null, 2));
  }
}

const mocksClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.mocks);

const portfolioClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.reporting);

const reactionsClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.reactions);

const filesClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.files);

const accountClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.account);

const partnerClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.partner);

const financeClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.finance);

const noteClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.note);

const landingPageClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.landingPage);

const operationsClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.operations);

const decisionClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.decisions);

const webhookSubscriptionClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.webhookSusbscriptions);

const strategyClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.strategy);

const cmsClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.cms);

const workflowClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.workflows);

const notificationsClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.notifications);

const layoutClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.layout);

// Websockets for local env

const backofficeClient = getApolloClientForUrl(graphqlProvider.websocketEndpoints.backoffice || graphqlProvider.graphqlEndpoints.backoffice);

const messageLoggerClient = getApolloClientForUrl(graphqlProvider.graphqlEndpoints.messageLogger);

export {
  accountClient,
  backofficeClient,
  cmsClient,
  decisionClient,
  filesClient,
  financeClient,
  landingPageClient,
  layoutClient,
  messageLoggerClient,
  mocksClient,
  noteClient,
  notificationsClient,
  operationsClient,
  partnerClient,
  portfolioClient,
  reactionsClient,
  strategyClient,
  webhookSubscriptionClient,
  workflowClient,
};

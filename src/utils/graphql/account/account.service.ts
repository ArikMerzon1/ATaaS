import _omitDeep from "omit-deep-lodash";
import {
  Query,
  Account,
  Mutation,
  ClaimData,
  AccountSearchResults,
  CaseManagementTask,
  AccountWidget,
  QueryToGetMetadataSchemaArgs,
  QueryToGetAccountWidgetGridArgs,
  MutationToDeleteCaseManagementGroupArgs,
  MutationToUpdateCaseManagementGroupArgs,
  MutationToCreateCaseManagementGroupArgs,
  MutationToDeleteCaseManagementTopicArgs,
  MutationToUpdateCaseManagementTopicArgs,
  MutationToCreateCaseManagementTopicArgs,
  MutationToResolveCaseManagementTasksArgs,
  MutationToResolveCaseManagementTaskArgs,
  MutationToCreateCaseManagementTaskArgs,
  MutationToSetClaimMetaArgs,
  QueryToGetCaseManagementTaskArgs,
  MutationToSendDebtorMessageArgs,
  QueryToSearchAccountsArgs,
  MutationToSetAccountDebtorFinancialInformationArgs,
  MutationToSetAccountWidgetGridArgs,
  MutationToUpdateAccountDebtorArgs,
  QueryToGetAccountClaimsArgs,
  QueryToGetAccountDataArgs,
  QueryToGetAccountLoanArgs,
  QueryToGetClaimDataArgs,
  MetadataSchema,
  MutationToSetMetadataSchemaArgs,
  MutationToRequestAccountRestructureArgs,
  MutationToSetAccountMetaArgs,
  MutationToRequestInvoicesProlongationArgs,
  MutationToCancelInvoicesProlongationArgs,
  QueryToGetInvoiceProlongationRequestsArgs,
  AccountOutstandingInvoicesProlongationRequest,
  QueryToGetAccountDiscountConfigurationsArgs,
  AccountDiscountConfiguration,
  QueryToGetAccountDiscountGridArgs,
  AccountDiscountGrid,
  MutationToRequestAccountDiscountArgs,
  MutationToReassignCaseManagementTasksArgs,
  MutationToUpdateCaseManagementTaskArgs,
  QueryToGetAccountLedgerEntriesArgs,
  ProlongationFeeStrategy,
  AccountLoan,
  QueryToGetAccountProlongationFeeStrategyArgs,
  QueryToGetClaimAccountIdArgs,
  DebtorPhoneNumber,
  ContactPhoneNumberState,
  AccountAggregators,
  AccountBulkAction,
  AccountBulkActionPayload,
  MutationToSkipCaseManagementTaskArgs,
  ClaimBulkAction,
  ClaimBulkActionPayload,
  MutationToStartCaseManagementTaskArgs,
  MutationToMarkCaseManagementTaskActiveArgs,
} from "@receeve-gmbh/account-backoffice-api";

import { FetchResult } from "@apollo/client/core";
import { LedgerEntry } from "../../models/ledger";
import { accountClient } from "../../apollo";
import * as queries from "./queries";
import * as mutations from "./mutations";
import omitDeepNil from "../../omitDeepNil";

export async function fetchClaimData(parameters: QueryToGetClaimDataArgs): Promise<ClaimData | null> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getClaimData,
    variables: parameters,
  });
  return data?.getClaimData || null;
}

export async function fetchAccountData(parameters: QueryToGetAccountDataArgs): Promise<Account | null> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getAccountData,
    variables: parameters,
    fetchPolicy: "cache-first",
  });

  if (!data?.getAccountData) {
    return null;
  }

  const cleaned = _omitDeep<Account>(data?.getAccountData, "__typename");

  return {
    ...cleaned,
    meta: JSON.parse(cleaned.meta || "{}"),
    ledgerEntries: JSON.parse(cleaned.ledgerEntries || "{}"),
    computedLedgerEntries: JSON.parse(cleaned.computedLedgerEntries || "{}"),
  };
}

export async function fetchAccountLedgerEntries(parameters: QueryToGetAccountLedgerEntriesArgs): Promise<LedgerEntry[]> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getAccountLedgerEntries,
    variables: parameters,
  });

  const ledgerEntries: unknown[] = data?.getAccountLedgerEntries ? JSON.parse(data?.getAccountLedgerEntries) : [];

  return _omitDeep(ledgerEntries, "__typename") as LedgerEntry[];
}

export async function fetchAccountLoan(parameters: QueryToGetAccountLoanArgs): Promise<AccountLoan | null> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getAccountLoan,
    variables: parameters,
    fetchPolicy: "cache-first",
  });

  if (!data?.getAccountLoan) {
    return null;
  }

  return _omitDeep<AccountLoan>(data?.getAccountLoan, "__typename");
}

export async function updateAccountDebtorFinancialInformation(parameters: MutationToSetAccountDebtorFinancialInformationArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.setAccountDebtorFinancialInformation,
    variables: parameters,
  });

  return !!data?.setAccountDebtorFinancialInformation;
}

export async function fetchAccountClaims(parameters: QueryToGetAccountClaimsArgs): Promise<ClaimData[]> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getAccountClaims,
    variables: parameters,
    fetchPolicy: "cache-first",
  });

  return (data?.getAccountClaims || []).map((claim) => ({
    ...claim,
    meta: JSON.parse(claim.meta || "{}"),
  }));
}

export async function sendMessageToDebtor(args: MutationToSendDebtorMessageArgs): Promise<boolean | null> {
  const { contentTemplateContent } = args;
  const variables: MutationToSendDebtorMessageArgs = { ...args };

  if (args.contentTemplateContent) {
    variables.contentTemplateContent = JSON.stringify(contentTemplateContent);
  }

  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.sendDebtorMessage,
    variables,
  });

  return data?.sendDebtorMessage || null;
}

export async function fetchSearchAccountResults(input: QueryToSearchAccountsArgs): Promise<AccountSearchResults> {
  const { data }: FetchResult<Query> = await accountClient.query({
    fetchPolicy: "cache-first",
    query: queries.searchAccounts,
    variables: input,
  });

  return data?.searchAccounts || { totalResults: 0, results: [] };
}

export async function fetchAccountDiscountConfigurations(parameters: QueryToGetAccountDiscountConfigurationsArgs): Promise<AccountDiscountConfiguration[]> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getAccountDiscountConfigurations,
    variables: parameters,
  });

  return data?.getAccountDiscountConfigurations?.map((discount) => _omitDeep<AccountDiscountConfiguration>(discount, "__typename")) || [];
}

export async function getAccountDiscountGrid(parameters: QueryToGetAccountDiscountGridArgs): Promise<AccountDiscountGrid[]> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getAccountDiscountGrid,
    variables: parameters,
  });

  return data?.getAccountDiscountGrid?.map((discount) => _omitDeep<AccountDiscountGrid>(discount, "__typename")) || [];
}

export async function fetchAccountTask(parameters: QueryToGetCaseManagementTaskArgs): Promise<CaseManagementTask | null> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getCaseManagementTask,
    variables: parameters,
  });

  if (!data?.getCaseManagementTask) {
    return null;
  }

  return _omitDeep<CaseManagementTask>(data?.getCaseManagementTask, "__typename");
}

// remove the boolean from return type after deployment of account-backoffice
export async function createCaseManagementTask(parameters: MutationToCreateCaseManagementTaskArgs): Promise<CaseManagementTask | null> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.createCaseManagementTask,
    variables: parameters,
  });

  accountClient.cache.reset();
  return data?.createCaseManagementTask || null;
}

export async function reassignCaseManagementTasks(parameters: MutationToReassignCaseManagementTasksArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.reassignCaseManagementTasks,
    variables: parameters,
  });

  accountClient.cache.reset();
  return !!data?.reassignCaseManagementTasks;
}

export async function updateCaseManagementTask(parameters: MutationToUpdateCaseManagementTaskArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.updateCaseManagementTask,
    variables: parameters,
  });

  accountClient.cache.reset();
  return !!data?.updateCaseManagementTask;
}

export async function resolveCaseManagementTasks(parameters: MutationToResolveCaseManagementTasksArgs): Promise<boolean | null> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.resolveCaseManagementTasks,
    variables: parameters,
  });

  accountClient.cache.reset();
  return data?.resolveCaseManagementTasks || null;
}

export async function resolveCaseManagementTask(parameters: MutationToResolveCaseManagementTaskArgs): Promise<boolean | null> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.resolveCaseManagementTask,
    variables: parameters,
  });

  accountClient.cache.reset();
  return data?.resolveCaseManagementTask || null;
}

export async function createCaseManagementTopic(parameters: MutationToCreateCaseManagementTopicArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.createCaseManagementTopic,
    variables: parameters,
  });

  accountClient.cache.reset();
  return !!data?.createCaseManagementTopic;
}

export async function updateCaseManagementTopic(parameters: MutationToUpdateCaseManagementTopicArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.updateCaseManagementTopic,
    variables: parameters,
  });

  accountClient.cache.reset();
  return !!data?.updateCaseManagementTopic;
}

export async function deleteCaseManagementTopic(parameters: MutationToDeleteCaseManagementTopicArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.deleteCaseManagementTopic,
    variables: parameters,
  });

  accountClient.cache.reset();
  return !!data?.deleteCaseManagementTopic;
}

export async function createCaseManagementGroup(parameters: MutationToCreateCaseManagementGroupArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.createCaseManagementGroup,
    variables: parameters,
  });

  accountClient.cache.reset();
  return !!data?.createCaseManagementGroup;
}

export async function updateCaseManagementGroup(parameters: MutationToUpdateCaseManagementGroupArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.updateCaseManagementGroup,
    variables: parameters,
  });

  accountClient.cache.reset();
  return !!data?.updateCaseManagementGroup;
}

export async function deleteCaseManagementGroup(parameters: MutationToDeleteCaseManagementGroupArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.deleteCaseManagementGroup,
    variables: parameters,
  });

  accountClient.cache.reset();
  return !!data?.deleteCaseManagementGroup;
}

export async function getAccountWidgetGrid(parameters: QueryToGetAccountWidgetGridArgs): Promise<AccountWidget[] | null> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getAccountWidgetGrid,
    variables: parameters,
  });

  return (data?.getAccountWidgetGrid?.widgets || []).map((widget) => _omitDeep(widget, "__typename"));
}

export async function setAccountWidgetGrid(parameters: MutationToSetAccountWidgetGridArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.setAccountWidgetGrid,
    variables: parameters,
  });

  accountClient.cache.reset();
  return Boolean(data?.setAccountWidgetGrid);
}

export async function getMetadataSchema(parameters: QueryToGetMetadataSchemaArgs): Promise<MetadataSchema | null> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getMetadataSchema,
    variables: parameters,
  });

  return data?.getMetadataSchema
    ? {
        ...data?.getMetadataSchema,
        schema: JSON.parse(data?.getMetadataSchema.schema || "{}"),
      }
    : null;
}

export async function setMetadataSchema(parameters: MutationToSetMetadataSchemaArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.setMetadataSchema,
    variables: {
      ...parameters,
      schema: JSON.stringify(parameters.schema),
    },
  });

  accountClient.cache.reset();
  return !!data?.setMetadataSchema;
}

export async function setAccountMeta(parameters: MutationToSetAccountMetaArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.setAccountMeta,
    variables: {
      ...parameters,
      meta: JSON.stringify(parameters.meta),
    },
  });

  accountClient.cache.reset();
  return !!data?.setAccountMeta;
}

export async function setClaimMeta(parameters: MutationToSetClaimMetaArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.setClaimMeta,
    variables: {
      ...parameters,
      meta: JSON.stringify(parameters.meta),
    },
  });

  return !!data?.setClaimMeta;
}

export async function fetchAccountId(parameters: QueryToGetClaimAccountIdArgs): Promise<string | null> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getClaimAccountId,
    variables: parameters,
  });

  return data?.getClaimAccountId || null;
}

export async function updateAccountDebtor(parameters: MutationToUpdateAccountDebtorArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.updateAccountDebtor,
    variables: omitDeepNil(parameters),
  });

  await accountClient.cache.reset();
  return !!data?.updateAccountDebtor;
}

export async function requestAccountRestructure(parameters: MutationToRequestAccountRestructureArgs): Promise<void> {
  await accountClient.mutate({
    mutation: mutations.requestAccountRestructure,
    variables: parameters,
  });
}

export async function requestAccountDiscount(parameters: MutationToRequestAccountDiscountArgs): Promise<void> {
  await accountClient.mutate({
    mutation: mutations.requestAccountDiscount,
    variables: parameters,
  });
}

export async function getInvoiceProlongationRequests(
  parameters: QueryToGetInvoiceProlongationRequestsArgs
): Promise<AccountOutstandingInvoicesProlongationRequest[]> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getInvoiceProlongationRequests,
    variables: parameters,
    fetchPolicy: "network-only",
  });

  return (data?.getInvoiceProlongationRequests || []).map((invoice) => ({
    ...invoice,
    ledgerEntries: JSON.parse(invoice.ledgerEntries),
  }));
}

export async function getAccountProlongationFeeStrategy(parameters: QueryToGetAccountProlongationFeeStrategyArgs): Promise<ProlongationFeeStrategy | null> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getAccountProlongationFeeStrategy,
    variables: parameters,
    fetchPolicy: "network-only",
  });

  return data?.getAccountProlongationFeeStrategy || null;
}

export async function requestInvoicesProlongation(parameters: MutationToRequestInvoicesProlongationArgs): Promise<void> {
  await accountClient.mutate({
    mutation: mutations.requestInvoicesProlongation,
    variables: parameters,
  });
}

export async function cancelInvoicesProlongation(parameters: MutationToCancelInvoicesProlongationArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.cancelInvoicesProlongation,
    variables: parameters,
  });

  return Boolean(data?.cancelInvoicesProlongation);
}

export async function cancelAccountRestructure(parameters: { clientId: string; accountId: string }): Promise<void> {
  await accountClient.mutate({
    mutation: mutations.cancelAccountRestructure,
    variables: parameters,
  });
}

export async function fetchAccountDebtorPhoneNumbers(parameters: { clientId: string; accountId: string }): Promise<DebtorPhoneNumber[] | []> {
  const { data }: FetchResult<Query> = await accountClient.query({
    query: queries.getAccountDebtorContactPhoneNumbers,
    variables: parameters,
    fetchPolicy: "network-only",
  });

  return data?.getAccountDebtorContactPhoneNumbers || [];
}

export async function setAccountDebtorContactPhoneNumberState(parameters: {
  clientId: string;
  accountId: string;
  contactPhoneNumber: string;
  contactPhoneNumberState?: ContactPhoneNumberState;
  externalDebtorRef?: string;
}): Promise<boolean> {
  const { data } = await accountClient.mutate<Mutation>({
    mutation: mutations.setAccountDebtorContactPhoneNumberState,
    variables: parameters,
  });

  return Boolean(data?.setAccountDebtorContactPhoneNumberState);
}

export async function getAllAccountPortfolios(input: { clientId: string; size: number; searchTerm: string }): Promise<string[]> {
  const { data } = await accountClient.query<Query>({
    query: queries.getAllAccountPortfolios,
    variables: input,
  });

  return data?.getAllAccountPortfolios || [];
}

export async function getAllAccountProductReferences(input: { clientId: string; size: number; searchTerm: string }): Promise<string[]> {
  const { data } = await accountClient.query<Query>({
    query: queries.getAllAccountProductReferences,
    variables: input,
  });

  return data?.getAllAccountProductReferences || [];
}

export async function getAccountAggregators(clientId: string): Promise<AccountAggregators> {
  const { data } = await accountClient.query<Query>({
    query: queries.getAccountAggregators,
    variables: { clientId },
  });

  const aggregators = data?.getAccountAggregators;
  return {
    count: aggregators.count || 0,
    ...(aggregators.minAmount ? { minAmount: aggregators.maxAmount } : {}),
    ...(aggregators.maxAmount ? { maxAmount: aggregators.maxAmount } : {}),
  };
}

export async function getAccountBulkAction(clientId: string, bulkActionId: string): Promise<AccountBulkAction | null> {
  const { data } = await accountClient.query<Query>({
    query: queries.getAccountBulkAction,
    variables: { clientId, bulkActionId },
  });

  return data?.getBulkAction || null;
}

export async function getBulkClaimAction(clientId: string, bulkActionId: string): Promise<ClaimBulkAction | null> {
  const { data } = await accountClient.query<Query>({
    fetchPolicy: "no-cache",
    query: queries.getBulkClaimAction,
    variables: { clientId, bulkActionId },
  });

  return data?.getBulkClaimAction || null;
}

export async function scheduleAccountBulkAction(clientId: string, payload: AccountBulkActionPayload): Promise<AccountBulkAction | null> {
  const { data } = await accountClient.mutate<Mutation>({
    mutation: mutations.scheduleAccountBulkAction,
    variables: { clientId, payload },
  });

  return data?.scheduleBulkAction || null;
}

export async function scheduleBulkClaimAction(clientId: string, payload: ClaimBulkActionPayload): Promise<ClaimBulkAction | null> {
  const { data } = await accountClient.mutate<Mutation>({
    mutation: mutations.scheduleBulkClaimAction,
    variables: { clientId, payload },
  });

  return data?.scheduleBulkClaimAction || null;
}

export async function skipCaseManagementTask(parameters: MutationToSkipCaseManagementTaskArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.skipCaseManagementTask,
    variables: parameters,
  });

  return Boolean(data?.skipCaseManagementTask);
}

export async function startCaseManagementTask(parameters: MutationToStartCaseManagementTaskArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.startCaseManagementTask,
    variables: parameters,
  });

  return Boolean(data?.startCaseManagementTask);
}

export async function markCaseManagementTasActive(parameters: MutationToMarkCaseManagementTaskActiveArgs): Promise<boolean> {
  const { data }: FetchResult<Mutation> = await accountClient.mutate({
    mutation: mutations.markCaseManagementTaskActive,
    variables: parameters,
  });

  return Boolean(data?.markCaseManagementTaskActive);
}

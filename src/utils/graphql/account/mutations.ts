import gql from "graphql-tag";

export const sendDebtorMessage = gql`
  mutation SendDebtorMessage(
    $clientId: String!
    $accountId: String!
    $channel: Channel!
    $locale: String!
    $bundleName: String
    $templateURL: String
    $externalClaimRef: String!
    $contentTemplateURL: String
    $contentTemplateContent: AWSJSON
    $bundleId: String
  ) {
    sendDebtorMessage(
      clientId: $clientId
      accountId: $accountId
      channel: $channel
      locale: $locale
      bundleName: $bundleName
      templateURL: $templateURL
      externalClaimRef: $externalClaimRef
      contentTemplateURL: $contentTemplateURL
      contentTemplateContent: $contentTemplateContent
      bundleId: $bundleId
    )
  }
`;

export const setAccountDebtorFinancialInformation = gql`
  mutation SetAccountDebtorFinancialInformation(
    $clientId: String!
    $accountId: String!
    $externalDebtorRef: String!
    $debtorFinancialInformation: DebtorFinancialInformationInput!
  ) {
    setAccountDebtorFinancialInformation(
      clientId: $clientId
      accountId: $accountId
      externalDebtorRef: $externalDebtorRef
      debtorFinancialInformation: $debtorFinancialInformation
    )
  }
`;

export const createCaseManagementTask = gql`
  mutation CreateCaseManagementTask($clientId: String!, $accountId: String!, $externalClaimRef: String, $task: CaseManagementTaskInput!) {
    createCaseManagementTask(clientId: $clientId, accountId: $accountId, externalClaimRef: $externalClaimRef, task: $task) {
      taskId
      clientId
      accountId
      externalClaimRef
      debtorFullName
      note
      recipientId
      senderId
      status
      tags
      topicId
      createdAt
      updatedAt
    }
  }
`;

export const resolveCaseManagementTasks = gql`
  mutation ResolveCaseManagementTasks(
    $clientId: String!
    $taskIds: [String!]!
    $taskFilter: CaseManagementTaskFilter
    $resolutionNote: String
    $resolverId: String
  ) {
    resolveCaseManagementTasks(clientId: $clientId, taskIds: $taskIds, taskFilter: $taskFilter, resolutionNote: $resolutionNote, resolverId: $resolverId)
  }
`;

export const resolveCaseManagementTask = gql`
  mutation ResolveCaseManagementTask(
    $clientId: String!
    $taskId: String!
    $resolutionNote: String
    $externalClaimRef: String
    $resolverId: String
    $accountId: String!
  ) {
    resolveCaseManagementTask(
      clientId: $clientId
      accountId: $accountId
      taskId: $taskId
      resolutionNote: $resolutionNote
      externalClaimRef: $externalClaimRef
      resolverId: $resolverId
    )
  }
`;

export const reassignCaseManagementTasks = gql`
  mutation ReassignCaseManagementTasks(
    $clientId: String!
    $taskIds: [String!]!
    $taskFilter: CaseManagementTaskFilter
    $groupId: String
    $topicId: String
    $recipientId: String
  ) {
    reassignCaseManagementTasks(
      clientId: $clientId
      taskIds: $taskIds
      taskFilter: $taskFilter
      groupId: $groupId
      topicId: $topicId
      recipientId: $recipientId
    )
  }
`;

export const updateCaseManagementTask = gql`
  mutation UpdateCaseManagementTask($clientId: String!, $taskId: String!, $task: CaseManagementTaskInput!, $accountId: String!) {
    updateCaseManagementTask(clientId: $clientId, taskId: $taskId, accountId: $accountId, task: $task) {
      taskId
    }
  }
`;

export const createCaseManagementTopic = gql`
  mutation CreateCaseManagementTopic($clientId: String!, $groupId: String, $name: String!, $userIds: [String!]) {
    createCaseManagementTopic(clientId: $clientId, groupId: $groupId, name: $name, userIds: $userIds)
  }
`;

export const updateCaseManagementTopic = gql`
  mutation UpdateCaseManagementTopic($clientId: String!, $topicId: String!, $groupId: String, $name: String!, $userIds: [String!]) {
    updateCaseManagementTopic(clientId: $clientId, topicId: $topicId, groupId: $groupId, name: $name, userIds: $userIds)
  }
`;

export const deleteCaseManagementTopic = gql`
  mutation DeleteCaseManagementTopic($clientId: String!, $topicId: String!) {
    deleteCaseManagementTopic(clientId: $clientId, topicId: $topicId)
  }
`;

export const createCaseManagementGroup = gql`
  mutation CreateCaseManagementGroup($clientId: String!, $name: String!, $logic: String!) {
    createCaseManagementGroup(clientId: $clientId, name: $name, logic: $logic)
  }
`;

export const updateCaseManagementGroup = gql`
  mutation UpdateCaseManagementGroup($clientId: String!, $groupId: String!, $name: String!, $logic: String!) {
    updateCaseManagementGroup(clientId: $clientId, groupId: $groupId, name: $name, logic: $logic)
  }
`;

export const deleteCaseManagementGroup = gql`
  mutation DeleteCaseManagementGroup($clientId: String!, $groupId: String!) {
    deleteCaseManagementGroup(clientId: $clientId, groupId: $groupId)
  }
`;

export const setAccountWidgetGrid = gql`
  mutation SetAccountWidgetGrid($clientId: String!, $widgets: [AccountWidgetInput!]!) {
    setAccountWidgetGrid(clientId: $clientId, widgets: $widgets)
  }
`;

export const setMetadataSchema = gql`
  mutation SetMetadataSchema($clientId: String!, $schemaType: MetadataSchemaType!, $schema: AWSJSON!) {
    setMetadataSchema(clientId: $clientId, schemaType: $schemaType, schema: $schema)
  }
`;

export const setAccountMeta = gql`
  mutation SetAccountMeta($clientId: String!, $accountId: String!, $meta: AWSJSON!) {
    setAccountMeta(clientId: $clientId, accountId: $accountId, meta: $meta)
  }
`;

export const setClaimMeta = gql`
  mutation SetClaimMeta($clientId: String!, $accountId: String!, $externalClaimRef: String!, $meta: AWSJSON!) {
    setClaimMeta(clientId: $clientId, accountId: $accountId, externalClaimRef: $externalClaimRef, meta: $meta)
  }
`;

export const updateAccountDebtor = gql`
  mutation UpdateAccountDebtor($clientId: String!, $accountId: String!, $debtor: DebtorWithContactInformationInput!) {
    updateAccountDebtor(clientId: $clientId, accountId: $accountId, debtor: $debtor)
  }
`;

export const requestAccountRestructure = gql`
  mutation RequestAccountRestructure($clientId: String!, $accountId: String!, $instalmentsPlan: InstalmentsPlanInput!) {
    requestAccountRestructure(clientId: $clientId, accountId: $accountId, instalmentsPlan: $instalmentsPlan)
  }
`;

export const requestAccountDiscount = gql`
  mutation RequestAccountDiscount($clientId: String!, $accountId: String!, $claimId: String!, $discounts: [AccountDiscountGridInput!]!) {
    requestAccountDiscount(clientId: $clientId, accountId: $accountId, claimId: $claimId, discounts: $discounts)
  }
`;

export const requestInvoicesProlongation = gql`
  mutation RequestInvoicesProlongation($clientId: String!, $accountId: String!, $days: Int!, $productReferences: [String!]) {
    requestInvoicesProlongation(clientId: $clientId, accountId: $accountId, days: $days, productReferences: $productReferences)
  }
`;

export const cancelInvoicesProlongation = gql`
  mutation CancelInvoicesProlongation($clientId: String!, $accountId: String!, $prolongationClaimRefs: [String!]!) {
    cancelInvoicesProlongation(clientId: $clientId, accountId: $accountId, prolongationClaimRefs: $prolongationClaimRefs)
  }
`;

export const cancelAccountRestructure = gql`
  mutation CancelAccountRestructure($clientId: String!, $accountId: String!) {
    cancelAccountRestructure(clientId: $clientId, accountId: $accountId)
  }
`;

export const setAccountDebtorContactPhoneNumberState = gql`
  mutation SetAccountDebtorContactPhoneNumberState(
    $clientId: String!
    $accountId: String!
    $contactPhoneNumber: String!
    $contactPhoneNumberState: ContactPhoneNumberState
    $externalDebtorRef: String
  ) {
    setAccountDebtorContactPhoneNumberState(
      clientId: $clientId
      accountId: $accountId
      contactPhoneNumber: $contactPhoneNumber
      contactPhoneNumberState: $contactPhoneNumberState
      externalDebtorRef: $externalDebtorRef
    )
  }
`;

export const scheduleAccountBulkAction = gql`
  mutation ScheduleBulkAction($clientId: String!, $payload: AccountBulkActionPayload!) {
    scheduleBulkAction(clientId: $clientId, payload: $payload) {
      bulkActionId
      action
      status
    }
  }
`;

export const scheduleBulkClaimAction = gql`
  mutation ScheduleBulkClaimAction($clientId: String!, $payload: ClaimBulkActionPayload!) {
    scheduleBulkClaimAction(clientId: $clientId, payload: $payload) {
      bulkActionId
      action
      status
    }
  }
`;

export const skipCaseManagementTask = gql`
  mutation SkipCaseManagementTask($clientId: String!, $accountId: String!, $taskId: String!) {
    skipCaseManagementTask(clientId: $clientId, accountId: $accountId, taskId: $taskId)
  }
`;

export const startCaseManagementTask = gql`
  mutation StartCaseManagementTask($clientId: String!, $accountId: String!, $taskId: String!) {
    startCaseManagementTask(clientId: $clientId, accountId: $accountId, taskId: $taskId)
  }
`;

export const markCaseManagementTaskActive = gql`
  mutation MarkCaseManagementTaskActive($clientId: String!) {
    markCaseManagementTaskActive(clientId: $clientId)
  }
`;

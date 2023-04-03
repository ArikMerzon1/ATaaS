import gql from "graphql-tag";

export const getClaimData = gql`
  query GetClaimData($clientId: String!, $externalClaimRef: String!) {
    getClaimData(clientId: $clientId, externalClaimRef: $externalClaimRef) {
      type
      amount
      currency
      dueDate
      externalClaimRef
      externalDueDate
      externalPortfolioRef
      meta
      paymentReference
      status
      totalAmount
      totalFees
      debtor {
        birthday
        companyName
        externalDebtorRef
        contactInformation {
          addressLine1
          addressLine2
          city
          country
          email
          landLine
          houseNumber
          mobileNumber
          postalCode
          state
        }
        firstName
        lastName
        middleName
        title
      }
      productReference
      createdAt
    }
  }
`;

export const getAccountData = gql`
  query GetAccountData($clientId: String!, $accountId: String, $externalDebtorRef: String) {
    getAccountData(clientId: $clientId, accountId: $accountId, externalDebtorRef: $externalDebtorRef) {
      id
      currency
      ledgerEntries
      computedLedgerEntries
      meta
      products {
        productReference
        name
      }
      scores {
        type
        value
        meta
      }
      debtorsWithFinancialInformation {
        birthday
        companyName
        SSN
        contactInformation {
          addressLine1
          addressLine2
          addressLine3
          city
          country
          email
          houseNumber
          landLine
          mobileNumber
          postalCode
          state
          suburb
          workPhoneNumber
          additionalAddresses {
            addressLine1
            addressLine2
            addressLine3
            city
            country
            houseNumber
            postalCode
            state
            suburb
          }
          additionalContactInformation {
            email
            mobileNumber
          }
        }
        debtorFinancialInformation {
          incomes {
            source
            amount
            currency
          }
          expenses {
            source
            amount
            currency
          }
        }
        externalDebtorRef
        firstName
        IBAN
        lastName
        middleName
        placeOfBirth
        title
        type
      }
    }
  }
`;

export const getAccountClaims = gql`
  query GetAccountClaims($clientId: String!, $accountId: String!) {
    getAccountClaims(clientId: $clientId, accountId: $accountId) {
      amount
      totalAmount
      totalFees
      currency
      dueDate
      status
      debtor {
        birthday
        companyName
        externalDebtorRef
        contactInformation {
          addressLine1
          addressLine2
          city
          country
          email
          landLine
          mobileNumber
          postalCode
          state
        }
        firstName
        lastName
        middleName
        title
      }
      externalClaimRef
      meta
      externalPortfolioRef
      type
      productReference
      createdAt
    }
  }
`;

export const getAccountLoan = gql`
  query GetAccountLoan($clientId: String!, $accountId: String!, $dueDate: String!) {
    getAccountLoan(clientId: $clientId, accountId: $accountId, dueDate: $dueDate) {
      amount
    }
  }
`;

export const searchAccounts = gql`
  query SearchAccounts(
    $clientId: String!
    $queryText: String
    $products: [String!]
    $portfolios: [String!]
    $outsourced: Boolean
    $debtorType: String
    $amountRange: AmountRangeInput
    $updatedAtRange: UnixTimestampRange
    $createdAtRange: UnixTimestampRange
    $oldestDueDateRange: ISODateRange
    $latestCommunicationRange: ISODateRange
    $from: Int!
    $size: Int!
    $orderFields: [OrderFieldInput!]
  ) {
    searchAccounts(
      clientId: $clientId
      queryText: $queryText
      products: $products
      portfolios: $portfolios
      outsourced: $outsourced
      debtorType: $debtorType
      amountRange: $amountRange
      updatedAtRange: $updatedAtRange
      createdAtRange: $createdAtRange
      oldestDueDateRange: $oldestDueDateRange
      latestCommunicationRange: $latestCommunicationRange
      from: $from
      size: $size
      orderFields: $orderFields
    ) {
      totalResults
      results {
        accountId
        debtorFullName
        debtorRef
        currency
        totalAmount
        activeClaimsCount

        oldestClaimDPD

        latestClaimDPD
        latestClaimRef
        latestClaimPortfolio
        latestCommunicationDate
      }
    }
  }
`;

export const getAccountLedgerEntries = gql`
  query GetAccountLedgerEntries($clientId: String!, $accountId: String!, $filter: LedgerEntriesFilter) {
    getAccountLedgerEntries(clientId: $clientId, accountId: $accountId, filter: $filter)
  }
`;

export const getCaseManagementTaskList = gql`
  query GetCaseManagementTaskList(
    $clientId: String!
    $topicIds: [String!]
    $groupIds: [String!]
    $filter: CaseManagementTaskFilter
    $orderBy: [CaseManagementTaskOrderBy!]
    $paginate: Paginate
    $userId: String
  ) {
    getCaseManagementTaskList(
      clientId: $clientId
      topicIds: $topicIds
      groupIds: $groupIds
      filter: $filter
      orderBy: $orderBy
      paginate: $paginate
      userId: $userId
    ) {
      tasks {
        accountId
        clientId
        debtorFullName
        externalClaimRef
        note
        taskId
        senderId
        recipientId
        resolutionNote
        status
        tags
        dueDate
        topicId
        resolvedAt
        resolverId
        createdAt
        updatedAt
        blueprintName
        updatedBy
      }
      total
    }
  }
`;

export const getOwnCaseManagementTaskList = gql`
  query GetOwnCaseManagementTaskList(
    $clientId: String!
    $topicIds: [String!]
    $groupIds: [String!]
    $filter: CaseManagementTaskFilter
    $orderBy: [CaseManagementTaskOrderBy!]
    $paginate: Paginate
    $userId: String
  ) {
    getOwnCaseManagementTaskList(
      clientId: $clientId
      topicIds: $topicIds
      groupIds: $groupIds
      filter: $filter
      orderBy: $orderBy
      paginate: $paginate
      userId: $userId
    ) {
      tasks {
        accountId
        clientId
        debtorFullName
        externalClaimRef
        note
        taskId
        senderId
        dueDate
        recipientId
        resolutionNote
        status
        tags
        topicId
        resolvedAt
        resolverId
        createdAt
        updatedAt
        blueprintName
        updatedBy
      }
      total
    }
  }
`;

export const getCaseManagementTopicList = gql`
  query GetCaseManagementTopicList($clientId: String!, $paginate: Paginate) {
    getCaseManagementTopicList(clientId: $clientId, paginate: $paginate) {
      topics {
        clientId
        topicId
        groupId
        name
        userIds
        createdAt
      }
      total
    }
  }
`;

export const getOwnCaseManagementTopicList = gql`
  query GetOwnCaseManagementTopicList($clientId: String!, $paginate: Paginate) {
    getOwnCaseManagementTopicList(clientId: $clientId, paginate: $paginate) {
      topics {
        clientId
        topicId
        groupId
        name
        userIds
        createdAt
      }
      total
    }
  }
`;

export const getCaseManagementGroupList = gql`
  query GetCaseManagementGroupList($clientId: String!, $paginate: Paginate) {
    getCaseManagementGroupList(clientId: $clientId, paginate: $paginate) {
      groups {
        clientId
        groupId
        name
        logic
        createdAt
      }
      total
    }
  }
`;

export const getOwnCaseManagementGroupList = gql`
  query GetOwnCaseManagementGroupList($clientId: String!, $paginate: Paginate) {
    getOwnCaseManagementGroupList(clientId: $clientId, paginate: $paginate) {
      groups {
        clientId
        groupId
        name
        logic
        createdAt
      }
      total
    }
  }
`;

export const getCaseManagementTask = gql`
  query GetCaseManagementTask($clientId: String!, $accountId: String!, $taskId: String!) {
    getCaseManagementTask(clientId: $clientId, accountId: $accountId, taskId: $taskId) {
      dueDate
      accountId
      clientId
      debtorFullName
      externalClaimRef
      note
      createdAt
      taskId
      recipientId
      resolutionNote
      resolvedAt
      senderId
      status
      tags
      topicId
      updatedBy
    }
  }
`;

export const getAccountWidgetGrid = gql`
  query GetAccountWidgetGrid($clientId: String!) {
    getAccountWidgetGrid(clientId: $clientId) {
      widgets {
        widgetId
        type
        label
        col
        row
        colSpan
        active
        fields {
          fieldId
          label
          path
        }
      }
    }
  }
`;

export const getMetadataSchema = gql`
  query GetMetadataSchema($clientId: String!, $schemaType: MetadataSchemaType!) {
    getMetadataSchema(clientId: $clientId, schemaType: $schemaType) {
      clientId
      schemaType
      schema
    }
  }
`;

export const getInvoiceProlongationRequests = gql`
  query GetInvoiceProlongationRequests($clientId: String!, $accountId: String!) {
    getInvoiceProlongationRequests(clientId: $clientId, accountId: $accountId) {
      days
      prolongationClaimRef
      context {
        productReferences
      }
      ledgerEntries
    }
  }
`;

export const getAccountProlongationFeeStrategy = gql`
  query GetAccountProlongationFeeStrategy($clientId: String!, $accountId: String!) {
    getAccountProlongationFeeStrategy(clientId: $clientId, accountId: $accountId) {
      type
      prolongationFeeStrategyConditions {
        amount
        lessOrEqualToDays
      }
    }
  }
`;

export const getAccountDiscountConfigurations = gql`
  query GetAccountDiscountConfigurations($clientId: String!, $externalClaimRef: String!) {
    getAccountDiscountConfigurations(clientId: $clientId, externalClaimRef: $externalClaimRef) {
      discountId
      type
      discount
    }
  }
`;

export const getAccountDiscountGrid = gql`
  query GetAccountDiscountGrid($clientId: String!, $accountId: String!, $externalClaimRef: String!) {
    getAccountDiscountGrid(clientId: $clientId, accountId: $accountId, externalClaimRef: $externalClaimRef) {
      ledgerEntryReference
      current
      discount
      discountApplied
      type
    }
  }
`;

export const getClaimAccountId = gql`
  query GetClaimAccountId($clientId: String!, $externalClaimRef: String!) {
    getClaimAccountId(clientId: $clientId, externalClaimRef: $externalClaimRef)
  }
`;

export const getAccountDebtorContactPhoneNumbers = gql`
  query GetAccountDebtorContactPhoneNumbers($clientId: String!, $accountId: String!) {
    getAccountDebtorContactPhoneNumbers(clientId: $clientId, accountId: $accountId) {
      clientId
      contactPhoneNumber
      contactPhoneNumberState
      type
    }
  }
`;

export const getAccountAggregators = gql`
  query GetAccountAggregators($clientId: String!) {
    getAccountAggregators(clientId: $clientId) {
      maxAmount
      minAmount
    }
  }
`;

export const getAllAccountProductReferences = gql`
  query GetAllAccountProductReferences($clientId: String!, $size: Int, $searchTerm: String) {
    getAllAccountProductReferences(clientId: $clientId, size: $size, searchTerm: $searchTerm)
  }
`;

export const getAllAccountPortfolios = gql`
  query GetAllAccountPortfolios($clientId: String!, $size: Int, $searchTerm: String) {
    getAllAccountPortfolios(clientId: $clientId, size: $size, searchTerm: $searchTerm)
  }
`;

export const getAccountBulkAction = gql`
  query GetAccountBulkAction($clientId: String!, $bulkActionId: String!) {
    getBulkAction(clientId: $clientId, bulkActionId: $bulkActionId) {
      action
      status
      result {
        fileURL
        message
        name
        code
      }
    }
  }
`;

export const getBulkClaimAction = gql`
  query GetBulkClaimAction($clientId: String!, $bulkActionId: String!) {
    getBulkClaimAction(clientId: $clientId, bulkActionId: $bulkActionId) {
      action
      status
      result {
        fileURL
        message
        name
        code
      }
    }
  }
`;

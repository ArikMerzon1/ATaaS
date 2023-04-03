/* eslint-disable prettier/prettier */
export enum SidebarMenuEnum {
  DASHBOARD = "Dashboard",
  AI = "AI",
  STRATEGY = "Strategy",
  CONTENT = "Content",
  ASSET_MANAGER = "Asset manager",
  ACCOUNT = "Account",
  TEST = "Test",
  CONFIGURATION = "Configuration",
  SELECT_CLIENT = "Client Select",
  NOTIFICATION = "Notification",
  HELP = "Help",
  LOGOUT = "Logout",
}

export enum ContentSubMenu {
  GLOBAL_SETTINGS = "Sidebar.Cms.cms-lp-client",
  LANDING_PAGE_BUILDER = "Sidebar.Cms.cms-landing-page",
  EMAIL_BUILDER = "Sidebar.Cms.cms-email-editor",
  MESSAGE_BUILDER = "Sidebar.Cms.cms-sms-editor",
  LETTER_BUILDER = "Sidebar.Cms.cms-letter-editor",
  ROBOCALL_BUILDER = "Sidebar.Cms.cms-calls-editor",
  LP_PLAYGROUND = "Sidebar.Cms.cms-lp-playground",
}

export enum StrategySubMenu {
  STRATEGY_BUILDER = "Sidebar.Journey.journey-strategy-builder-new",
  DECISION_TREE = "Sidebar.Journey.journey-decision-tree",
  SIMULATOR = "Sidebar.Journey.journey-simulator",
  REACTIONS = "Sidebar.Journey.reactions",
}

export enum AssetManagerSubMenu {
  PARTNERS = "Sidebar.Asset.asset-partners",
  TRANSACTIONS = "Sidebar.Asset.asset-transactions",
}

export enum ConfigurationSubMenu {
  GENERAL = "Sidebar.Configuration.configuration-general",
  OPERATIONS = "Operations",
  SCHEDULES = "Schedules",
  USERS = "Users",
  WEBHOOKS = "Webhooks",
  QUEUES = "Queues",
  WORKFLOW = "Workflows",
  ROLE_MANAGEMENT = "Role management",
}

export enum DashboardSubMenu {
  operationalDashboard = "Sidebar.Dashboard.dashboard-operational",
  operationalDashboards = "Sidebar.Dashboard.custom-dashboard",
  communicationOverview = "Communication overview",
  contentInsights = "Sidebar.Dashboard.insights-content-insights",
  landingPageInsights = "Sidebar.Dashboard.insights-lp-analytics",
  reports = "Sidebar.Dashboard.insights-reports",
  paymentInsights = "Sidebar.Dashboard.insights-payments",
  chartCreator = "Sidebar.Dashboard.visualization-dashboard",
}

export enum AccountsSubMenu {
  QUEUES = "Sidebar.Account.account-queue",
  CLAIM_OVERVIEW = "Sidebar.Account.insights-claim-list",
  ACCOUNT_MANAGEMENT = "Sidebar.Account.account-search",
}

export enum TestExecutor {
  local = "local",
  deviceFarm = "deviceFarm",
  pCloudy = "pCloudy",
  sauceLab = "sauceLab",
  perfecto = "perfecto",
  lambdaTest = "lambdatest",
  browserstack = "browserstack",
}

export enum SupportedBrowsers {
  chrome = "chrome",
  firefox = "firefox",
}

export enum Events {
  "event.claim.created" = "event.claim.created",
  "event.claimDebtPayment.processing" = "event.claimDebtPayment.processing",
  "event.debtorEmail.queued" = "event.debtorEmail.queued",
  "event.debtorSMS.queued" = "event.debtorSMS.queued",
  "event.promiseToPay.created" = "event.promiseToPay.created",
  "event.promiseToPay.invalidated" = "event.promiseToPay.invalidated",
  "event.promiseToPay.resolved" = "event.promiseToPay.resolved",
  "event.promiseToPay.expired" = "event.promiseToPay.expired",
  "event.instalmentsPlan.created" = "event.instalmentsPlan.created",
  "event.instalmentsPlan.failed" = "event.instalmentsPlan.failed",
  "event.instalmentsPlan.invalidated" = "event.instalmentsPlan.invalidated",
  "event.instalmentsPlan.resolved" = "event.instalmentsPlan.resolved",
  "event.instalment.expired" = "event.instalment.expired",
  "event.instalment.invalidated" = "event.instalment.invalidated",
  "event.instalment.resolved" = "event.instalment.resolved",
  "event.instalment.started" = "event.instalment.started",
}

export enum StrategyActions {
  SMS = "sms",
  EMAIL = "email",
  LETTER = "letter",
  ENABLE_CALLBACK = "Enable Callback",
  DISABLE_CALLBACK = "Disable Callback",
  ENABLE_REPLIES = "Enable Replies",
  DISABLE_REPLIES = "Disable Replies",
  PLACE_CALL = "Place Call",
  FINANCIAL_ASSESSMENT = "Financial Assessment",
  ADD_ACCOUNT_TO_CALL_LIST = "Add Account To Call List",
  REMOVE_ACCOUNT_TO_CALL_LIST = "Remove Account From Call List",
  EVALUATE_IF_CONDITION_IS_HOLIDAY = "If Condition",
}

export enum UserRoleCognito {
  ADMIN = ":ADMIN",
  SUPERVISOR = ":SUPERVISOR",
  AGENT = ":AGENT",
  REPORTING_ONLY = ":REPORTING_ONLY",
  ANALYST = ":ANALYST",
  PREVIEW = ":PREVIEW",
}

export enum UserRoleBackoffice {
  CLIENT_ADMIN = "CLIENT_ADMIN",
  SUPERVISOR = "SUPERVISOR",
  PREVIEW = "PREVIEW",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
  REPORTING_ONLY = "REPORTING_ONLY",
  ANALYST = "ANALYST",
}

export enum CurrencyEnum {
  EUR,
  USD,
}

export enum LandingPageView {
  CardView,
  ListView,
}

export enum PaymentProvider {
  "swish",
  "split",
  "sofort",
  "trustly",
  "paysafe",
  "wirecard",
  "checkoutSepa",
  "fintecsystems",
  "checkoutSofort",
  "ferratumSofort",
  "ferratumCheckoutCreditCard",
  "ferratumCheckoutCreditCardV2",
  "paylandsenBizum",
  "paylandsenCards",
  "fakeCards",
  "unnax",
}

export enum TitlesList {
  Mr = "Mr",
  Ms = "Ms",
  Mrs = "Mrs",
  Miss = "Miss",
  Ambassador = "Ambassador",
  Archbishop = "Archbishop",
  Archdeacon = "Archdeacon",
  Baron = "Baron",
  Baroness = "Baroness",
  Bishop = "Bishop",
  Canon = "Canon",
  Cardinal = "Cardinal",
  Congressman = "Congressman",
  Councillor = "Councillor",
  Doctor = "Doctor",
  Father = "Father",
  Governor = "Governor",
  Imam = "Imam",
  Inspector = "Inspector",
  Judge = "Judge",
  Justice = "Justice",
  Nurse = "Nurse",
  Police = "Police",
  Constable = "Constable",
  President = "President",
  Professor = "Professor",
  Rabbi = "Rabbi",
  Representative = "Representative",
  Senator = "Senator",
  Superintendent = "Superintendent",
}

export enum PartnerType {
  EXTERNAL = "EXTERNAL",
  INTERNAL = "INTERNAL",
}

export enum ClaimStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
  RESOLVED = "RESOLVED",
}

export enum EditorType {
  SMS = "SMS",
  EMAIL = "Email",
  LP = "Landing Page",
  LETTER = "Letter",
  CALL = "Call",
}

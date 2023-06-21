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
  GLOBAL_SETTINGS = "Sidebar.Cms.cms_lp_client",
  LANDING_PAGE_BUILDER = "Sidebar.Cms.cms_landing_page",
  EMAIL_BUILDER = "Sidebar.Cms.cms_email_editor",
  MESSAGE_BUILDER = "Sidebar.Cms.cms_sms_editor",
  LETTER_BUILDER = "Sidebar.Cms.cms_letter_editor",
  ROBOCALL_BUILDER = "Sidebar.Cms.cms_calls_editor",
  LP_PLAYGROUND = "Sidebar.Cms.cms_lp_playground",
}

export enum StrategySubMenu {
  STRATEGY_BUILDER = "Sidebar.Journey.journey_strategy_builder_new",
  DECISION_TREE = "Sidebar.Journey.journey_decision_tree",
  SIMULATOR = "Sidebar.Journey.journey_simulator",
  REACTIONS = "Sidebar.Journey.reactions",
}

export enum AssetManagerSubMenu {
  PARTNERS = "Sidebar.Asset.asset_partners",
  TRANSACTIONS = "Sidebar.Asset.asset_transactions",
}

export enum ConfigurationSubMenu {
  GENERAL = "Sidebar.Configuration.configuration_general",
  OPERATIONS = "Sidebar.Configuration.configuration_operations",
  SCHEDULES = "Sidebar.Configuration.configuration_schedule",
  USERS = "Sidebar.Configuration.configuration_users",
  USER_AUDIT = "Sidebar.Configuration.configuration_user-audit",
  WEBHOOKS = "Sidebar.Configuration.configuration_webhooks",
  QUEUES = "Sidebar.Configuration.configuration_queues",
  WORKFLOW = "Sidebar.Configuration.configuration_workflows",
  ROLE_MANAGEMENT = "Sidebar.Configuration.configuration_roles",
}

export enum DashboardSubMenu {
  OPERATIONAL_DASHBOARD = "Sidebar.Dashboard.dashboard_operational",
  OPERATIONAL_DASHBOARDS = "Sidebar.Dashboard.custom_dashboard",
  COMMUNICATION_OVERVIEW = "Communication overview",
  CONTENT_INSIGHTS = "Sidebar.Dashboard.insights_content_insights",
  LANDING_PAGE_INSIGHTS = "Sidebar.Dashboard.insights_lp_analytics",
  REPORTS = "Sidebar.Dashboard.insights_reports",
  PAYMENT_INSIGHTS = "Sidebar.Dashboard.insights_payments",
  CHART_CREATOR = "Sidebar.Dashboard.visualization_dashboard",
}

export enum AccountsSubMenu {
  TASKS = "Sidebar.Account.account_queue",
  CLAIM_OVERVIEW = "Sidebar.Account.insights_claim_list",
  ACCOUNT_MANAGEMENT = "Sidebar.Account.account_search",
}

export enum TestExecutor {
  local = "local",
  deviceFarm = "deviceFarm",
  pCloudy = "pCloudy",
  lambdaTest = "lambdatest",
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
  MESSAGE = "message",
  EMAIL = "email",
  LETTER = "letter",
  ENABLE_CALLBACK = "Enable Callback",
  DISABLE_CALLBACK = "Disable Callback",
  ENABLE_REPLIES = "Enable_Replies",
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
  CARD_VIEW,
  LIST_VIEW,
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

export enum ContentObjectMenu {
  EDIT,
  CLONE,
  DELETE,
}

export enum TaskTabSelect {
  ACCOUNT_QUEUE,
  WORKFLOW_ACTIVE_STEPS,
}

export enum TimePeriod {
  OVERDUE = "overdue",
  DUE_TODAY = "due today",
  UPCOMING = "upcoming",
  NO_DUE_DATE = "no due date",
}

export enum GeneralConfigurationCards {
  NAME = "name",
  COUNTRY = "country",
  TIMEZONE = "timezone",
  DATA_AND_NUMBER_FORMAT = "data and number format",
  DOMAIN = "domain",
  EMAIL = "email",
  MAILGUN = "mailgun",
  CONTENT_AND_STRATEGY_CATEGORIES = "content and strategy categories",
  TASKS_TAGS = "tasks tags",
  METADATA_SCHEMAS = "metadata schemas",
  ABOUT = "about",
}

export interface ITestGridSessions {
  arn: string;
  status: string;
  created: string;
  seleniumProperties: ISeleniumProperties;
}

export interface ISeleniumProperties {
  browser: string;
  browserVersion: string;
  platform: string;
}

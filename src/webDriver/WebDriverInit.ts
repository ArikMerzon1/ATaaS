import { injectable } from "tsyringe";
import { Builder, ThenableWebDriver } from "selenium-webdriver";
import * as firefox from "selenium-webdriver/firefox";
import * as chrome from "selenium-webdriver/chrome";
import geckodriver from "geckodriver";
import chromedriver from "chromedriver";
import WebDriverInitOptions from "../utils/WebDriverInitOptions";
import { TestExecutor } from "../utils/Enums";
import AwsDeviceFarmSetup from "../utils/AwsDeviceFarmSetup";

@injectable()
export class WebDriverInit {
  private _driver!: ThenableWebDriver;
  deviceFarmInit!: AwsDeviceFarmSetup;

  async setup(webDriverInitOptions: WebDriverInitOptions): Promise<void> {
    switch (webDriverInitOptions.executor) {
      case TestExecutor.local:
        await this.localSetup(webDriverInitOptions);
        return;
      case TestExecutor.lambdaTest:
        await this.lambdaTest(webDriverInitOptions);
        return;
      default:
        console.error(`This executor don't exists: ${webDriverInitOptions.executor}`);
    }
  }

  async localSetup(webDriverInitOptions: WebDriverInitOptions): Promise<void> {
    try {
      console.log(`Executor: ${webDriverInitOptions.executor}`);
      console.log(`Browser selected: ${webDriverInitOptions.browser}`);
      switch (webDriverInitOptions.browser) {
        case "firefox":
          const defaultFireFoxFlags = [
            // '--headless',
            "--disable-gpu",
            // "--window-size=1280x1696", // Letter size'--no-sandbox',
            "--user-data-dir=/tmp/user-data",
            "--hide-scrollbars",
            "--enable-logging",
            "--log-level=0",
            "--v=99",
            // "--single-process",
            "--data-path=/tmp/data-path",
            "--ignore-certificate-errors",
            "--homedir=/tmp",
            "--disk-cache-dir=/tmp/cache-dir",
            "--start-maximized",
          ];
          const firefoxServiceBuilder = new firefox.ServiceBuilder(geckodriver.path);
          const firefoxOptions = new firefox.Options();
          defaultFireFoxFlags.forEach((flag) => firefoxOptions.addArguments(flag));
          if (webDriverInitOptions.headless) firefoxOptions.headless();
          this.driver = new Builder()
            .forBrowser(webDriverInitOptions.browser)
            .setFirefoxService(firefoxServiceBuilder)
            .setFirefoxOptions(firefoxOptions)
            .build();
          break;
        case "chrome":
          const defaultChromeFlags = [
            // '--headless',
            "--disable-gpu",
            "--window-size=1280x1696", // Letter size'--no-sandbox',
            "--user-data-dir=/tmp/user-data",
            "--hide-scrollbars",
            "--enable-logging",
            "--log-level=0",
            "--v=99",
            "--single-process",
            "--data-path=/tmp/data-path",
            "--ignore-certificate-errors",
            "--homedir=/tmp",
            "--disk-cache-dir=/tmp/cache-dir",
          ];
          const chromeServiceBuilder = new chrome.ServiceBuilder(chromedriver.path);
          const chromeOptions = new chrome.Options();
          defaultChromeFlags.forEach((flag) => chromeOptions.addArguments(flag));
          if (webDriverInitOptions.headless) chromeOptions.headless();
          this.driver = new Builder().forBrowser(webDriverInitOptions.browser).setChromeService(chromeServiceBuilder).setChromeOptions(chromeOptions).build();
          break;
        default:
          console.error("unknown browser type");
      }
      await this.driver.get(webDriverInitOptions.url);
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  async lambdaTest(webDriverInitOptions: WebDriverInitOptions): Promise<void> {
    try {
      const USERNAME = process.env.LAMBDA_USERNAME;
      const KEY = process.env.LAMBDA_KEY;
      const GRID_HOST = process.env.LAMBDA_GRID_HOST;

      const serverPath = `https://${USERNAME}:${KEY}@${GRID_HOST}`;

      console.log(`Executor: ${webDriverInitOptions.executor}`);
      console.log(`Browser selected: ${webDriverInitOptions.browser}`);

      switch (webDriverInitOptions.browser) {
        case "firefox":
          this.driver = new Builder()
            .usingServer(serverPath)
            .withCapabilities({
              region: "eu",
              platform: "Windows 10",
              browserName: "Firefox",
              version: "109.0.1",
              resolution: "1920x1080",
              network: false, // don't enable!!!
              terminal: true,
              visual: true,
              console: true,
              video: true,
              name: expect.getState().currentTestName,
              build: `${webDriverInitOptions.suitName}`,
              selenium_version: "4.1.2",
            })
            .build();
          break;
        case "chrome":
          this.driver = new Builder()
            .usingServer(serverPath)
            .forBrowser(webDriverInitOptions.browser)
            .withCapabilities({
              region: "eu",
              platform: "Windows 10",
              browserName: "chrome",
              version: "latest",
              resolution: "1920x1080",
              network: false, // don't enable!!!
              terminal: true,
              visual: true,
              console: true,
              video: true,
              name: expect.getState().currentTestName,
              build: `${webDriverInitOptions.suitName}`,
              selenium_version: "4.1.2",
            })
            .build();
          break;
        default:
          console.error("unknown browser type!!!");
      }
      await this.driver.get(webDriverInitOptions.url);
    } catch (err) {
      console.error(err);
    }
  }

  get driver(): ThenableWebDriver {
    return this._driver;
  }

  set driver(value: ThenableWebDriver) {
    this._driver = value;
  }
}

export default { WebDriverInit };

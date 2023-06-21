import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
import { ThenableWebDriver } from "selenium-webdriver";
import { container } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { Backoffice } from "../pageObjects/mainPageObjects/Backoffice";
import AwsDeviceFarmSetup from "../utils/AwsDeviceFarmSetup";
import { SupportedBrowsers, TestExecutor } from "../utils/Enums";
import WebDriverInitOptions from "../utils/WebDriverInitOptions";
import Helpers from "../utils/helpers";
import RestClientBootstrapper from "../webDriver/RestClientBootstrapper";
import { WebDriverInit } from "../webDriver/WebDriverInit";
import { minuteToMs } from "../utils/minuteToMs";

dotenv.config();

export default abstract class AbstractTestBase {
  static webDriver: ThenableWebDriver;
  static timeOut = minuteToMs(6);
  static doubleTimeOut = minuteToMs(12);
  static backofficeInstance: Backoffice;
  private static deviceFarmInit: AwsDeviceFarmSetup;
  private static suitName = `ATaaS-${uuidv4()}`;

  static before(): void {
    console.log("before all");
    jest.setTimeout(this.timeOut);
    AbstractTestBase.deleteFilesFromFolder().then(() => console.log("Old reports deleted"));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  before() {
    console.log("before each");
    console.log("Test name: ", expect.getState()?.currentTestName);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async after() {
    console.log("after each");
    jest.setTimeout(AbstractTestBase.timeOut);

    let testResult = "passed";
    const testName = expect.getState().currentTestName;
    const match = Object.keys(global.testStatuses).find((item: string) => item === testName);
    if (match) {
      const testStatus = global.testStatuses[match];

      if (testStatus.status === "failed" || testStatus.status === "error") {
        testResult = "failed";
        console.error(`Test finished with error :  ${testStatus.error?.message}`);
        if ("webDriver" in AbstractTestBase) {
          await Helpers.takeScreenshot("test_finished_with_error");
        }
      }
    }

    if (AbstractTestBase.backofficeInstance) {
      if (typeof AbstractTestBase.backofficeInstance.LoginPage() !== "undefined" && AbstractTestBase.backofficeInstance.LoginPage().isLoggedIn) {
        await AbstractTestBase.backofficeInstance.Logout();
      }

      const executor = container.resolve("executor");
      console.log(`Executor ${executor}`);
      switch (executor) {
        case TestExecutor.lambdaTest:
          await AbstractTestBase.webDriver.executeScript(`lambda-status=${testResult}`);
          await AbstractTestBase.webDriver.executeScript(`lambda-name=${expect.getState().currentTestName}`);
          break;
        default:
          console.log("Remote executor not found");
          break;
      }

      await AbstractTestBase.backofficeInstance.QuitWebdriver();
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  static async after() {
    console.log("after all");
    try {
      // await AbstractTestBase.backofficeInstance.QuitWebdriver();

      if (!Helpers.isNullOrUndefined(this.webDriver)) {
        await Helpers.archiveReportDir();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async withWebDriver(): Promise<Backoffice> {
    try {
      const webDriverInit = container.resolve(WebDriverInit);
      const driverOptions = AbstractTestBase.setWebDriverOptions();
      await webDriverInit.setup(driverOptions);
      AbstractTestBase.webDriver = webDriverInit.driver;
      container.register("webDriver", { useValue: AbstractTestBase.webDriver });

      if (AbstractTestBase.webDriver === null || AbstractTestBase.webDriver === undefined) console.error(`webDriver has not created`);

      if (webDriverInit.deviceFarmInit !== null && webDriverInit.deviceFarmInit !== undefined) AbstractTestBase.deviceFarmInit = webDriverInit.deviceFarmInit;

      await AbstractTestBase.webDriver.manage().window().maximize();
      await AbstractTestBase.webDriver.get(driverOptions.url);
      AbstractTestBase.backofficeInstance = container.resolve(Backoffice);
      return AbstractTestBase.backofficeInstance;
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  withRestClient = (): RestClientBootstrapper => container.resolve(RestClientBootstrapper);

  static setWebDriverOptions(): WebDriverInitOptions {
    const webDriverInitOptions: WebDriverInitOptions = {
      executor: Helpers.getValue(process.env.TEST_EXECUTOR) as TestExecutor,
      browser: Helpers.getValue(process.env.BROWSER) as SupportedBrowsers,
      url: Helpers.getValue(process.env.BACKOFFICE_BASE_URL) as string,
      headless: Helpers.getValue(process.env.HEADLESS) === "true",
      suitName: this.suitName.toString(),
    };

    container.register("executor", { useValue: webDriverInitOptions.executor });
    return webDriverInitOptions;
  }

  private static async deleteFilesFromFolder(): Promise<void> {
    console.log("DeleteFilesFromFolder");
    const directoryPath = path.join(__dirname, "../../reports");
    if (fs.existsSync(directoryPath)) {
      // eslint-disable-next-line consistent-return
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          return console.error(`Unable to scan directory: ${err}`);
        }
        files.forEach((file) => {
          const filePath = path.join(directoryPath, file);
          console.log(`file to delete: ${filePath}`);
          // eslint-disable-next-line consistent-return
          return fs.rmdir(filePath, { recursive: true }, (error) => {
            if (error) {
              console.error(`Unable to delete directory: ${error}`);
            }
          });
        });
      });
    }
  }
}

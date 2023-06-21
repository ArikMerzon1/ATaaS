import * as fs from "fs";
import https from "https";
import _get from "lodash.get";
import path from "path";
import { By, Key, until, WebDriver, WebElement, WebElementPromise } from "selenium-webdriver";
import { container } from "tsyringe";
import { zip } from "zip-a-folder";
import FindElementError from "../errors/FindElementError";
import { TestExecutor } from "./Enums";
import HelpersBase from "./helpersbase";
import { IAWSArtifact } from "./IAWSArtifact";
import { RetrierOptions } from "./models/util";

const DELAY = 1000;
const MAX_TRIES = 10;

export default class Helpers extends HelpersBase {
  static async click(element: WebElement): Promise<void> {
    console.log("Click");
    const webDriver: WebDriver = container.resolve("webDriver");
    await webDriver.executeScript("arguments[0].click();", element);
  }

  static async scrollToElement(element: WebElement): Promise<void> {
    console.log("ScrollToElement");
    const webDriver: WebDriver = container.resolve("webDriver");
    await webDriver.executeScript("arguments[0].scrollIntoView();", element);
    await this.sleep(2);
  }

  static async scrollUpOrDown(scroll: string): Promise<void> {
    console.log("ScrollUpOrDown");
    const webDriver: WebDriver = container.resolve("webDriver");
    switch (scroll) {
      case "up":
        await webDriver.executeScript("window.scrollBy(0,-1000)");
        break;
      case "down":
        await webDriver.executeScript("window.scrollBy(0,1000)");
        break;
      default:
        console.error("wrong scrolling command");
    }
  }

  static async scrollToElementBySelector(selector: By): Promise<void> {
    const element = await this.getElement(selector);
    await this.scrollToElement(element);
  }

  static async sendKeys(element: WebElement, value: string): Promise<void> {
    console.log("SendKeys");
    await this.clearInputField(element);
    await this.sleep(2);
    for (let i = 0; i < value.length; i += 1) {
      await element.sendKeys(value[i]);
    }
  }

  static async sleep(seconds: number): Promise<void> {
    if (seconds > 2) console.warn("Please consider using a Polling methode instead of a static Wait !!!");

    return this.delay(seconds * 1000);
  }

  private static async delay(milliseconds = 0): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  static async clearInputField(element: WebElement): Promise<void> {
    console.log("ClearInputField");
    const value = await element.getAttribute("value");
    for (let i = 0; i < value.length; i += 1) {
      await element.sendKeys(Key.BACK_SPACE);
    }
  }

  static async takeScreenshot(fileName: string): Promise<void> {
    console.log("Take Screenshot");
    const executor = this.getValue(process.env.TEST_EXECUTOR);
    switch (executor) {
      case TestExecutor.local:
      case TestExecutor.deviceFarm:
      case TestExecutor.pCloudy:
        try {
          const testName = expect.getState()?.currentTestName?.split(" ").pop();
          const screenshotsFolder = path.join(__dirname, `../../reports/${testName}`);
          if (!fs.existsSync(screenshotsFolder)) {
            fs.mkdir(screenshotsFolder, (err) => {
              if (err && err.code !== "EEXIST") {
                console.warn("not folder already exists");
              }
            });
          }
          const webDriver: WebDriver = container.resolve("webDriver");
          const filePath = path.join(screenshotsFolder, `${fileName}_${Date.now()}.png`);
          console.log(`screenshot path: ${filePath}`);
          webDriver.takeScreenshot().then((data) => {
            const base64Data = data.replace(/^data:image\/png;base64,/, "");
            fs.writeFile(filePath, base64Data, "base64", (err) => {
              if (err) {
                console.error(err);
                throw new Error(err.message);
              }
            });
          });
        } catch (error) {
          throw JSON.stringify(error, null, 2);
        }
        break;
      default:
        console.log("Screenshot not taken!!!");
    }
  }

  static async waitForElement(
    selector: By,
    highlightElement = false,
    checkLoading = true,
    checkVisibility = true,
    optTimeout = 2000,
    optPollTimeout = 500,
    iterator = 5
  ): Promise<void> {
    try {
      console.log(`waiting for element to appear: ${selector}`);
      const webDriver: WebDriver = container.resolve("webDriver");

      if (checkVisibility) {
        const element = await webDriver.wait(until.elementLocated(selector), optTimeout, `element not Located after ${optTimeout}ms`, optPollTimeout);
        await webDriver.wait(until.elementIsEnabled(element), optTimeout, `element not Enabled after ${optTimeout}ms`, optPollTimeout);

        if (highlightElement) await this.highlightElement(element);

        console.log(`isDisplayed: ${await element.isDisplayed()}`);
        console.log(`isEnabled: ${await element.isEnabled()}`);

        if (!(await element.isDisplayed()) || !(await element.isEnabled())) {
          throw Error("ElementNotInteractableError");
        }
      }
      if (checkLoading) {
        const isLoading: WebElement = await webDriver.executeScript("return document.querySelector('.is-loading')");
        const loadingBackground: WebElement = await webDriver.executeScript("return document.querySelector('.loading-background')");
        if (!Helpers.isNullOrUndefined(isLoading) || !Helpers.isNullOrUndefined(loadingBackground)) throw Error("NoSuchElementError");
      }

      await this.waitForNetworkCallToFinish();
    } catch (error) {
      const message = _get(error, "message");
      console.log(`iterator: ${iterator}`);
      console.warn(`error message: ${message?.toString()}`);
      if (
        (message?.toString().includes("NoSuchElementError") ||
          message?.toString().includes("ElementNotInteractableError") ||
          message?.toString().includes("ElementNotInteractableError") ||
          message?.toString().includes("or the document has been refreshed") ||
          message?.toString().includes("ElementClickInterceptedError") ||
          message?.toString().includes("element not Located after")) &&
        iterator
      ) {
        iterator--;
        await this.sleep(1);
        await this.waitForElement(selector, highlightElement, checkLoading, checkVisibility, optTimeout, optPollTimeout, iterator);
      }
    }
  }

  static async checkIfElementExists(selector: By): Promise<boolean> {
    try {
      const webDriver: WebDriver = container.resolve("webDriver");
      await this.waitForElement(selector);
      return await webDriver.findElement(selector).isDisplayed();
    } catch {
      return false;
    }
  }

  static async getElement(
    selector: By,
    highlightElement = false,
    checkLoading = true,
    checkVisibility = true,
    optTimeout = 4000,
    optPollTimeout = 500,
    iterator = 5
  ): Promise<WebElementPromise> {
    console.log("GetElement");
    try {
      const webDriver: WebDriver = container.resolve("webDriver");
      await this.waitForElement(selector, highlightElement, checkLoading, checkVisibility, optTimeout, optPollTimeout, iterator);
      return webDriver.findElement(selector);
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }

  static async getElements(
    selector: By,
    highlightElement = false,
    checkLoading = true,
    checkVisibility = true,
    optTimeout = 2000,
    optPollTimeout = 500
  ): Promise<WebElement[]> {
    console.log("GetElements");
    try {
      const webDriver: WebDriver = container.resolve("webDriver");
      await this.waitForElement(selector, highlightElement, checkLoading, checkVisibility, optTimeout, optPollTimeout);
      return webDriver.findElements(selector);
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  static async getElementWithinElement(
    element: WebElement,
    selector: By,
    highlightElement = false,
    checkLoading = true,
    checkVisibility = true,
    optTimeout = 2000,
    optPollTimeout = 500
  ): Promise<WebElement> {
    console.log("GetElementWithinElement");
    try {
      await this.waitForElement(selector, highlightElement, checkLoading, checkVisibility, optTimeout, optPollTimeout);
      return element.findElement(selector);
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  static async getElementsWithinElement(
    element: WebElement,
    selector: By,
    highlightElement = false,
    checkLoading = true,
    checkVisibility = true,
    optTimeout = 2000,
    optPollTimeout = 500
  ): Promise<WebElement[]> {
    console.log("GetElementsWithinElement");
    try {
      await this.waitForElement(selector, highlightElement, checkLoading, checkVisibility, optTimeout, optPollTimeout);
      return element.findElements(selector);
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  static async getElementsWithinElementBy(
    element: By,
    selector: By,
    highlightElement = false,
    checkLoading = true,
    checkVisibility = true,
    optTimeout = 2000,
    optPollTimeout = 500
  ): Promise<WebElement[]> {
    console.log("getElementsWithinElement");
    try {
      const elm = await Helpers.getElement(selector, highlightElement, checkLoading, checkVisibility, optTimeout, optPollTimeout);
      return Helpers.getElementsWithinElement(elm, selector, highlightElement, checkLoading, checkVisibility, optTimeout, optPollTimeout);
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  static async waitForTextToAppear(selector: By): Promise<void> {
    console.log("WaitForTextToAppear");
    return new Promise(() => setTimeout(Helpers.waitForText, 10000, selector));
  }

  static async waitForText(selector: By, expectedText = ""): Promise<boolean> {
    console.log("WaitForText");
    try {
      let text = "";
      while (text === "") {
        const element = await this.getElement(selector, false, true, true, 6000, 100);
        text = await element.getText();
        console.log(`current text: ${text}`);
        if (text === expectedText) return true;
        await Helpers.sleep(1);
      }
      return false;
    } catch (error) {
      throw JSON.stringify(error, null, 2);
    }
  }

  static async waitForNetworkCallToFinish(): Promise<void> {
    try {
      let element = true;
      while (element) {
        const loaders = await this.findElements(By.css(".loading-overlay.is-active"));
        const loadersState = await Promise.all(loaders.map((loader) => this.isDisplayed(loader)));

        element = loadersState.some((loader) => loader);

        console.log("waitForNetworkCallToFinish", element);
        await Helpers.sleep(1);
      }
    } catch (error) {
      if (error instanceof FindElementError) {
        // it means that the loader is not displayed and network call has finished execution
      } else {
        throw error;
      }
    }
  }

  static async waitForAttribute(element: WebElement, attribute: string): Promise<string> {
    console.log("WaitForAttribute");
    try {
      let iterator = 5;
      let expectedAttributeValue = "";
      while (expectedAttributeValue !== attribute && iterator > 1) {
        expectedAttributeValue = await element.getAttribute(attribute);
        console.log(`attribute value: ${expectedAttributeValue}`);
        if (expectedAttributeValue !== null) break;
        await Helpers.sleep(2);
        iterator--;
      }
      return expectedAttributeValue;
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }

  static isNullOrUndefined = (value: unknown | null | undefined): value is null | undefined => {
    return value === null || value === undefined;
  };

  static getValue(value: unknown): unknown {
    console.log(`getValue: "${value}"`);
    if (!this.isNullOrUndefined(value)) return value;

    console.error(`value: "${value}" is null or empty`);
    throw Error(`value: "${value}" is null or empty`).stack;
  }

  static async highlightElement(element: WebElement): Promise<void> {
    console.log("HighLighterElement");
    const webDriver: WebDriver = container.resolve("webDriver");
    await webDriver.executeScript("return arguments[0].setAttribute('style', 'border: 2px solid red;');", element);

    setTimeout(async () => {
      await webDriver.executeScript("return arguments[0].setAttribute('style', '');", element);
    }, 2000);
    await this.sleep(1);
  }

  static async saveFile(artifact: IAWSArtifact): Promise<void> {
    console.log(`saving file: ${artifact.filename}`);
    try {
      https.get(artifact.url, (res) => {
        const testName = expect.getState()?.currentTestName?.split(" ").pop();
        const reportsFolder = path.join(__dirname, `../../reports/${testName}`);
        if (!fs.existsSync(reportsFolder)) {
          fs.mkdir(reportsFolder, (err) => {
            if (err && err.code !== "EEXIST") {
              console.warn("note, folder already exists!");
            }
          });
        }
        const reportsFile = path.join(__dirname, `../../reports/${testName}/${artifact.filename}`);
        const filePath = fs.createWriteStream(reportsFile, { encoding: "utf8" });
        return new Promise((resolve, reject) => {
          filePath.on("error", (err) => reject(err));

          const stream = res.pipe(filePath);

          stream.on("close", () => {
            try {
              resolve(filePath);
            } catch (err) {
              reject(err);
            }
          });
          console.log("Download Completed");
        });
      });
    } catch (error) {
      console.error(error);
      throw Error(JSON.stringify(error, null, 2));
    }
  }

  static async archiveReportDir(): Promise<unknown> {
    try {
      console.log("ArchiveReportDir");
      const reportsPath = path.join(__dirname, `../../reports`);
      const zipFilePath = path.join(__dirname, `../../report.zip`);
      return await zip(`${reportsPath}`, `${zipFilePath}`);
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  public static getRandomNumberBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static async findAsync<T extends object | null>(arr: T[], asyncCallback: (value: T, index: number, array: T[]) => Promise<T>): Promise<T> {
    const promises = arr.map(asyncCallback);
    const results = await Promise.all(promises);
    const index = results.findIndex((result) => result);
    return arr[index];
  }

  public static async setAttribute(element: WebElement, attName: string, attValue: string): Promise<void> {
    const webDriver: WebDriver = container.resolve("webDriver");
    await webDriver.executeScript("arguments[0].setAttribute(arguments[1], arguments[2]);", element, attName, attValue);
  }

  public static async removeClass(element: WebElement, className: string): Promise<void> {
    const webDriver: WebDriver = container.resolve("webDriver");
    await webDriver.executeScript("arguments[0].classList.remove(arguments[1])", element, className);
  }

  public static async retrier<T = unknown>(
    call: (tries: number) => Promise<T | undefined | null>,
    options?: RetrierOptions<T | undefined | null>
  ): Promise<T | undefined | null> {
    let tries = 0;
    let result: T | undefined | null = null;

    const maxTries = options?.maxTries || MAX_TRIES;
    const delayTime = typeof options?.delay === "number" ? options.delay : DELAY;
    const checkFn = options?.checkFn || ((result: T) => !!result);

    do {
      tries += 1;

      await this.delay(delayTime);

      result = await call(tries);
    } while (!checkFn(result as T) && tries <= maxTries);

    return result;
  }
}

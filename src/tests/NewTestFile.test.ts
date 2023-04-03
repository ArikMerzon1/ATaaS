import "reflect-metadata";
import { suite, test, timeout } from "@testdeck/jest";
import dummyJson from "dummy-json";
import { container } from "tsyringe";
import fs from "fs";
import AbstractTestBase from "./AbstractTestBase";
import { ClaimGeneratorForm, EventsEmitter } from "../utils/EventsEmitter";

@suite("suite1")
class NewTestFileTest extends AbstractTestBase {
  @test("newTest1")
  @timeout(AbstractTestBase.timeOut)
  async newTest1(): Promise<void> {
    // await Helpers.archiveReportDir();
    // await AbstractTestBase.deleteFilesFromFolder();
  }

  @test("newTest2")
  @timeout(AbstractTestBase.timeOut)
  async newTest2(): Promise<void> {
    try {
      fs.writeFile("/Users/ariksmac/Desktop/demo.txt", "Foo bar!", () => {
        console.error("ERROR ---");
      });

      // const products = ["playstation", 3, "laptop", 2, "Television", 1, "Mobile", 5];
      //
      // const newArr = products.map((n, i, arr) => ({ product: n, quantity: arr[i + 1] })).filter((n, i) => i % 2 === 0);
      //
      // console.log(newArr);
    } catch (err) {
      console.error(err);
      console.error(err.trace);
    }
    // const newArr = products as IProduct[];
    // const newArr2 = <Array<IProduct>>products;

    // const backoffice = await this.withWebDriver();
    // await backoffice.LoginPage().Login();
    // await helpers.sleep(10);

    // const s3FileWriterService = container.resolve(S3FileWriterService);
    // await s3FileWriterService.foo("https://devicefarm-prod-us-west-2-testgrid-results-nwo17noa.s3.us-west-2.amazonaws.com/094315163199/86450032-5172-42b9-b8db-c27176975b43/871b131f-8c7e-4117-9696-f8ef839c62ab/AROAUYCPRZIW2JOQZP3Y2%3Ai-0b3e94f76b7e15a61/log/selenium_webdriver.log?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFgaCXVzLXdlc3QtMiJHMEUCIFRfaXrecbF0O%2FKe%2BVIW8HJ2FxdYKYQqw5wy5K9PZwDOAiEAzUDcJhAothMjBlmtt3acOUNCGQ9NkhKz5SPjtWUe2Kwq6QII0f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgwzNDA2ODE1Mjc4OTEiDOLbWfmbmCjw2Eb17iq9AhftTAIiEyIin%2BuGciHl442dgWy2TG%2FxOcRlIzZOvST330OsBDzVEeZtD%2BM5ZvQBvN5H8CphIGSnaB5N1v%2F8Cm13s8EVJLfqvKdjxiYiTxHfT7%2Bjph1atoKvvyuwAPa%2FC%2FtJVL4dJ24uwAL%2B4hv6ZhEwV3ahCT7SioybdfcCT2DKEx0I4xqS0fTMTCgiiwQ34pbHyOVNoeAgtRMS2q8zJWFwUtkC9rRPkPxwj0Jn27VC%2FIP3%2Bn3tHL8tqZTD5wIoDKNcM4P1melA8jJ3ZVMc9ePL5ngYQYsDUTS52iF3%2FmOdPfcG6T4us2WGhinVBBGZk%2B7ReGcDhRPexNq6zgAVBhdzL5r1blYPfuup6wf8OG71bEEz7GwTYSJWq3kqDGbBX0EtUhVqPJJ71At%2FbArB62BAv5gI3p3hrjxkLfyTMPX9oZgGOr8BGeSN0wKKXvDAMj3vmWghoJLvtygc5IfuTvfq%2BpJtOmA1L86%2F077BQQmZQjaGp9JI8BdnZfeWc01RX5fO%2B1BcYe5MCo370IuEwI5Vs7Rgv%2F14Fb4RyoalhGhiNsO1B%2BDB6FO%2F%2FCxDdQgoJXF3dh0MmsgdR2XyyzVjIdju9lVij8ECl8xuAxTft0c%2FRgvv4yrlhNlzPXX%2BX5ggUse0M4EEQ1XpnzvxGTJLy%2B6LrJD%2FLfxzHZxzeSj%2Bo3ZU%2Fo%2FrH70%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220826T081723Z&X-Amz-SignedHeaders=host&X-Amz-Expires=10800&X-Amz-Credential=ASIAU6URTSJJZDQEITHQ%2F20220826%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=63c127094513a0953228b1c2c7e5380d10b4fc49396a7e4466b0983dfd6f1000");
  }

  @test("newTest3")
  @timeout(AbstractTestBase.timeOut)
  async newTest3(): Promise<void> {
    const json = {
      claimCreate: {
        attributes: {
          clientId: "3d132b18-6b6f-4f7c-b464-6a8ee7ca5235",
          messageVersion: "1",
          messageType: "cmd.claim.create",
          externalClaimRef: "",
        },
        payload: {
          amount: 181181,
          totalFees: 8168,
          currency: "EUR",
          dueDate: "{{date '2020' '2020' 'YYYY-MM-DD'}}",
          externalDueDate: "2021-06-06",
          externalClaimRef: "dd-2021-07-21_2021-06-21-76666",
          externalPortfolioRef: "Cards",
          debtor: {
            lastName: "{{lastName}}",
            birthday: "{{date '1900' '2000' 'YYYY-MM-DD'}}",
            firstName: "{{firstName}}",
            externalDebtorRef: "1c99873d-4403-4936-8b49-841fc18f2280",
            contactInformation: {
              country: "GB",
              city: "London",
              addressLine1: "Apt 123",
              state: "United Kingdom",
              postalCode: "{{int 11111 99999 '00000'}}",
              email: "{{email}}",
              landLine: "+4915127554465",
              mobileNumber: "+4915127554464",
              addressLine2: "{{int 1 100}} {{street}} {{city}}",
              additionalAddresses: [],
            },
          },
          meta: {
            testWhat: "automation",
            accountTestMetaTag: "yes",
          },
        },
      },
    };

    const result = dummyJson.parse(JSON.stringify(json));
    const newClaim = JSON.parse(result) as ClaimGeneratorForm;

    const eventsEmitter = container.resolve(EventsEmitter);
    await eventsEmitter.emitClaims(newClaim.claimCreate);
  }
}

export interface IProduct {
  product: string;
  quantity: number;
}

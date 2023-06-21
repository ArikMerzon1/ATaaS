import { suite, test, timeout } from "@testdeck/jest";
import AbstractTestBase from "./AbstractTestBase";
import LandingPageBuilderPageObject from "../pageObjects/content/LandingPageBuilderPageObject";
import { ContentSubMenu, SidebarMenuEnum } from "../utils/Enums";
import helpers from "../utils/helpers";
import EmailBuilderPageObject from "../pageObjects/content/EmailBuilderPageObject";
import MessagingBuilderPageObject from "../pageObjects/content/MessagingBuilderPageObject";
import LetterBuilderPageObject from "../pageObjects/content/LetterBuilderPageObject";

@suite("uitests")
class ContentBuildersTest extends AbstractTestBase {
  @test("landingPageBuilderTest")
  @timeout(AbstractTestBase.timeOut)
  async landingPageBuilder(): Promise<void> {
    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login();
    const lpBuilder: LandingPageBuilderPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.CONTENT)
    ).SelectFromSubMenu(ContentSubMenu.LANDING_PAGE_BUILDER);

    const landingPageCreator = await lpBuilder.createLandingPage(true);
    const landingPageName = `test_name_${helpers.getRandomNumberBetween(10, 10000000)}`;
    await landingPageCreator.setLandingPageName(landingPageName);
    await landingPageCreator.setPageTitle("test_name");
    await landingPageCreator.save();
    await landingPageCreator.backButton();

    await lpBuilder.findLandingPageByName(landingPageName);

    await helpers.sleep(2);
    await helpers.takeScreenshot("landingPageListView");
  }

  @test("emailbuildertest")
  @timeout(AbstractTestBase.timeOut)
  async emailPageBuilderTest(): Promise<void> {
    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login();
    const emailBuilder: EmailBuilderPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.CONTENT)
    ).SelectFromSubMenu(ContentSubMenu.EMAIL_BUILDER);

    const emailCreat = await emailBuilder.createEmail("Phones");
    await emailCreat.setNameOfTheEmail("test_3");
    await emailCreat.setSubject("sub_3", "view_3");
    await emailCreat.save();
    await emailCreat.backButton();

    await emailBuilder.findEmailPageByName("test_3");

    await helpers.sleep(2);
    await helpers.takeScreenshot("landingPageListView");
  }

  @test("messagebuildertest")
  @timeout(AbstractTestBase.timeOut)
  async messageBuilderTest(): Promise<void> {
    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login();
    const msgBuilder: MessagingBuilderPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.CONTENT)
    ).SelectFromSubMenu(ContentSubMenu.MESSAGE_BUILDER);

    const msgName = `test_${helpers.getRandomNumberBetween(1000, 10000000)}`;
    const msgCreate = await msgBuilder.createMessagingContext(msgName);
    await (await msgCreate.setSmsSender("Twilly")).setBody("some amount: {{amount}}");
    await msgCreate.save();
    await msgCreate.backButton();

    await msgBuilder.findMessageByName(msgName);
    await helpers.takeScreenshot(msgName);
  }

  @test("letterbuildertest")
  @timeout(AbstractTestBase.timeOut)
  async letterBuilderTest(): Promise<void> {
    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login();
    const letterBuilder: LetterBuilderPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.CONTENT)
    ).SelectFromSubMenu(ContentSubMenu.LETTER_BUILDER);

    await letterBuilder.createLetterContext("test_1", "Billie_2");

    await helpers.takeScreenshot("letterName");
  }
}

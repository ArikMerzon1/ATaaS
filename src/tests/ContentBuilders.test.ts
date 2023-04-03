import { suite, test, timeout } from "@testdeck/jest";
import AbstractTestBase from "./AbstractTestBase";
import LandingPageBuilderPageObject from "../pageObjects/content/LandingPageBuilderPageObject";
import { ContentSubMenu, SidebarMenuEnum } from "../utils/Enums";
import helpers from "../utils/helpers";
import EmailBuilderPageObject from "../pageObjects/content/EmailBuilderPageObject";

// @suite("uitests")
@suite("contentbuilderstest")
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

  @test("emailbuilder")
  @timeout(AbstractTestBase.timeOut)
  async emailPageBuilder(): Promise<void> {
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
}

import "reflect-metadata";
import { suite, test, timeout } from "@testdeck/jest";
import assert from "assert";

import { AssetManagerSubMenu, PartnerType, SidebarMenuEnum } from "../utils/Enums";
import AbstractTestBase from "./AbstractTestBase";
import AssetPartnersListPageObject from "../pageObjects/assetManager/AssetPartnersListPageObject";

@suite("partnerTests")
class AssetPartnerTests extends AbstractTestBase {
  @test("Partners:Smoketest")
  @timeout(AbstractTestBase.timeOut)
  async smokeTest(): Promise<void> {
    const backoffice = await this.withWebDriver();
    await backoffice.LoginPage().Login();
    const assetPartners: AssetPartnersListPageObject = await (
      await backoffice.SidebarMenu().SelectTab(SidebarMenuEnum.ASSET_MANAGER)
    ).SelectFromSubMenu(AssetManagerSubMenu.PARTNERS);

    const isDataExists = await assetPartners.checkDataExists();

    if (isDataExists) {
      let message: string;

      await assetPartners.selectPartnerTypeExternal();

      const partnerTypes = await assetPartners.getPartnerTypes();

      const isAllPartnerTypeExternal = partnerTypes.every((partnerType) => partnerType === PartnerType.EXTERNAL);

      assert.strictEqual(isAllPartnerTypeExternal, true);

      await assetPartners.searchPartnerWithFirstPartnerName();

      const searchResultCount = await assetPartners.getPartnersCount();

      message = "Search functionality is not working as expected";
      assert.strictEqual(1, searchResultCount, message);

      const partnerName = await assetPartners.getFirstPartnerName();

      const partnerObject = await assetPartners.selectFirstPartner();

      const name = await partnerObject.getPartnerName();
      const type = await partnerObject.getPartnerType();

      message = "Partner info mismatched in partner list and partner details";
      assert.strictEqual(type, partnerTypes?.[0], message);
      assert.strictEqual(name, partnerName, message);

      const tabsCount = await partnerObject.getPartnerDetailsTabs();

      message = "Partner information is missing";
      assert.strictEqual(tabsCount, 2, message);

      let partnerDetailsSections = await partnerObject.getPartnerDetailsSections();

      message = "Contact details and configuration details section should both exist for external partner";
      assert.deepStrictEqual(partnerDetailsSections, { contactDetails: true, configurationDetails: true }, message);

      const editEmailText = await partnerObject.getPartnerEditEmail();

      assert.strictEqual(editEmailText, partnerObject.testEmail);

      const isButtonsDisabled = await partnerObject.getIsSaveAndRevertButtonDisabled();

      assert.strictEqual(isButtonsDisabled, true);

      const isButtonsDisabledAfterEdit = await partnerObject.getIsSaveAndRevertButtonDisabledAfterEdit();
      assert.strictEqual(false, isButtonsDisabledAfterEdit);

      await partnerObject.changePartnerTypeToInternal();

      partnerDetailsSections = await partnerObject.getPartnerDetailsSections();
      message = "Only contact details section should exist for internal partners";
      assert.deepStrictEqual(partnerDetailsSections, { contactDetails: true, configurationDetails: false }, message);

      message = "Partner type not reflecting correctly";
      let partnerType = await partnerObject.getPartnerType();
      assert.strictEqual(partnerType, PartnerType.INTERNAL, message);

      await partnerObject.changePartnerTypeToExternalWithEmptyValues();
      const errors = await partnerObject.getErrorMessages();
      const expectedErrors = ["Please select a valid interval", "Please provide a Outsource method", "Please provide a valid time"];
      message = "Errors are not as expected";
      assert.deepStrictEqual(errors, expectedErrors, message);

      await partnerObject.changePartnerTypeToExternalWithValidValues();
      partnerDetailsSections = await partnerObject.getPartnerDetailsSections();
      message = "Edit partner is not working as expected";
      assert.deepStrictEqual(partnerDetailsSections, { contactDetails: true, configurationDetails: true }, message);

      message = "Partner type not reflecting correctly";
      partnerType = await partnerObject.getPartnerType();
      assert.strictEqual(partnerType, PartnerType.EXTERNAL, message);
    }
  }
}

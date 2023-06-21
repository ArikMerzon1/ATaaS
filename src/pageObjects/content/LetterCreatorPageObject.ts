import { injectable } from "tsyringe";
import { By } from "selenium-webdriver";
import ContentCreatorBase from "./ContentCreatorBase";
import helpers from "../../utils/helpers";

@injectable()
export default class LetterCreatorPageObject extends ContentCreatorBase {
  async setName(name: string): Promise<this> {
    console.log("SetName");
    const nameInput = await helpers.getElement(By.css(`[name="DATE"]`));
    await helpers.sendKeys(nameInput, name);
    return this;
  }
  async setInvoiceNumber(invoiceNumber: string): Promise<this> {
    console.log("SetInvoiceNumber");
    const nameInput = await helpers.getElement(By.css(`[name="INVOICE_NUMBER"]`));
    await helpers.sendKeys(nameInput, invoiceNumber);
    return this;
  }
  async setInvoiceIssueDate(invoiceIssueDate: string): Promise<this> {
    console.log("");
    const nameInput = await helpers.getElement(By.css(`[name="INVOICE_ISSUE_DATE"]`));
    await helpers.sendKeys(nameInput, invoiceIssueDate);
    return this;
  }
  async setTotalAmount(totalAmount: string): Promise<this> {
    console.log("");
    const nameInput = await helpers.getElement(By.css(`[name="TOTAL_AMOUNT"]`));
    await helpers.sendKeys(nameInput, totalAmount);
    return this;
  }
  async sePaymentIBAN(paymentIBAN: string): Promise<this> {
    console.log("");
    const nameInput = await helpers.getElement(By.css(`[name="PAYMENT_IBAN"]`));
    await helpers.sendKeys(nameInput, paymentIBAN);
    return this;
  }
  async setPaymentBIC(paymentBIC: string): Promise<this> {
    console.log("");
    const nameInput = await helpers.getElement(By.css(`[name="PAYMENT_BIC"]`));
    await helpers.sendKeys(nameInput, paymentBIC);
    return this;
  }
  async setDisclaimer(disclaimer: string): Promise<this> {
    console.log("");
    const nameInput = await helpers.getElement(By.css(`[name="DISCLAIMER"]`));
    await helpers.sendKeys(nameInput, disclaimer);
    return this;
  }
}

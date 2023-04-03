import { FeeLedgerEntry } from "@receeve-gmbh/account-api/FeeLedgerEntry";
import { InvoiceLedgerEntry } from "@receeve-gmbh/account-api/InvoiceLedgerEntry";
import { PaymentLedgerEntry } from "@receeve-gmbh/account-api/PaymentLedgerEntry";
import { AdjustmentLedgerEntry } from "@receeve-gmbh/account-api/AdjustmentLedgerEntry";
import { ChargebackLedgerEntry } from "@receeve-gmbh/account-api/ChargebackLedgerEntry";
import { DiscountLedgerEntry } from "@receeve-gmbh/account-api/DiscountLedgerEntry";
import { LedgerEntry as BaseLedgerEntry } from "@receeve-gmbh/account-api/LedgerEntry";

import { ComputedLedgerEntryState } from "@receeve-gmbh/account-api/AccountDTO";

export enum LedgerType {
  FEE = "fee",
  PAYMENT = "payment",
  ADJUSTMENT = "adjustment",
  INVOICE = "invoice",
  CHARGEBACK = "chargeback",
  DISCOUNT = "discount",
}

export type ComputedLedgerEntry = LedgerEntry & { state: ComputedLedgerEntryState };

export type LedgerEntry = BaseLedgerEntry &
  Pick<FeeLedgerEntry, "feeDetails"> &
  Pick<InvoiceLedgerEntry, "invoiceDetails"> &
  Pick<AdjustmentLedgerEntry, "adjustmentDetails"> &
  Pick<PaymentLedgerEntry, "paymentDetails"> &
  Pick<ChargebackLedgerEntry, "chargebackDetails"> &
  Pick<DiscountLedgerEntry, "discountDetails">;

export type LedgerDetails = { amount: number } & Partial<
  FeeLedgerEntry["feeDetails"] &
    InvoiceLedgerEntry["invoiceDetails"] &
    AdjustmentLedgerEntry["adjustmentDetails"] &
    PaymentLedgerEntry["paymentDetails"] &
    ChargebackLedgerEntry["chargebackDetails"] &
    DiscountLedgerEntry["discountDetails"]
>;

export function getLedgerDetails(ledgerEntry: LedgerEntry): LedgerDetails | null {
  const ledgerDetails: LedgerDetails | null = null;

  switch (ledgerEntry.type) {
    case LedgerType.FEE:
      return ledgerEntry.feeDetails;
    case LedgerType.INVOICE:
      return ledgerEntry.invoiceDetails;
    case LedgerType.ADJUSTMENT:
      return ledgerEntry.adjustmentDetails;
    case LedgerType.PAYMENT:
      return ledgerEntry.paymentDetails;
    case LedgerType.CHARGEBACK:
      return ledgerEntry.chargebackDetails;
    case LedgerType.DISCOUNT:
      return ledgerEntry.discountDetails;
    default:
      break;
  }

  return ledgerDetails;
}

import { ReferencedSchemas } from "@receeve-gmbh/emit-message";
import ClaimSchema from "@receeve-gmbh/account-api/Claim.json";
import DebtorSchema from "@receeve-gmbh/account-api/Debtor.json";
import RepaymentSchema from "@receeve-gmbh/account-api/Repayment.json";
import ClaimOriginationSchema from "@receeve-gmbh/account-api/ClaimOrigination.json";
import ProviderNameSchema from "@receeve-gmbh/payments-api/ProviderName.json";
import LedgerEntrySchema from "@receeve-gmbh/account-api/LedgerEntry.json";
import InvoiceLedgerEntrySchema from "@receeve-gmbh/account-api/InvoiceLedgerEntry.json";
import FeeLedgerEntrySchema from "@receeve-gmbh/account-api/FeeLedgerEntry.json";
import PaymentLedgerEntrySchema from "@receeve-gmbh/account-api/PaymentLedgerEntry.json";
import AdjustmentLedgerEntrySchema from "@receeve-gmbh/account-api/AdjustmentLedgerEntry.json";
import AnalyticsTinyUrlContextSchema from "@receeve-gmbh/landingpage-api/AnalyticsTinyUrlContext.json";
import MandateRepresentationSchema from "@receeve-gmbh/payments-api/MandateRepresentation.json";
import BankAccountMandateRepresentationSchema from "@receeve-gmbh/payments-api/BankAccountMandateRepresentation.json";
import CardMandateRepresentationSchema from "@receeve-gmbh/payments-api/CardMandateRepresentation.json";
import ResolutionReasonSchema from "@receeve-gmbh/account-api/ResolutionReason.json";
import ProductSchema from "@receeve-gmbh/account-api/Product.json";

export default function getRefSchemas(): ReferencedSchemas {
  return {
    "Product.json": ProductSchema,
    "Claim.json": ClaimSchema,
    "Debtor.json": DebtorSchema,
    "Repayment.json": RepaymentSchema,
    "ClaimOrigination.json": ClaimOriginationSchema,
    "ProviderName.json": ProviderNameSchema,
    "LedgerEntry.json": LedgerEntrySchema,
    "InvoiceLedgerEntry.json": InvoiceLedgerEntrySchema,
    "FeeLedgerEntry.json": FeeLedgerEntrySchema,
    "PaymentLedgerEntry.json": PaymentLedgerEntrySchema,
    "AdjustmentLedgerEntry.json": AdjustmentLedgerEntrySchema,
    "AnalyticsTinyUrlContext.json": AnalyticsTinyUrlContextSchema,
    "MandateRepresentation.json": MandateRepresentationSchema,
    "BankAccountMandateRepresentation.json": BankAccountMandateRepresentationSchema,
    "CardMandateRepresentation.json": CardMandateRepresentationSchema,
    "ResolutionReason.json": ResolutionReasonSchema,
  };
}

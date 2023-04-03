import { ReferencedSchemas } from "@exness/emit-message";
import ClaimSchema from "@exness/account-api/Claim.json";
import DebtorSchema from "@exness/account-api/Debtor.json";
import RepaymentSchema from "@exness/account-api/Repayment.json";
import ClaimOriginationSchema from "@exness/account-api/ClaimOrigination.json";
import ProviderNameSchema from "@exness/payments-api/ProviderName.json";
import LedgerEntrySchema from "@exness/account-api/LedgerEntry.json";
import InvoiceLedgerEntrySchema from "@exness/account-api/InvoiceLedgerEntry.json";
import FeeLedgerEntrySchema from "@exness/account-api/FeeLedgerEntry.json";
import PaymentLedgerEntrySchema from "@exness/account-api/PaymentLedgerEntry.json";
import AdjustmentLedgerEntrySchema from "@exness/account-api/AdjustmentLedgerEntry.json";
import AnalyticsTinyUrlContextSchema from "@exness/landingpage-api/AnalyticsTinyUrlContext.json";
import MandateRepresentationSchema from "@exness/payments-api/MandateRepresentation.json";
import BankAccountMandateRepresentationSchema from "@exness/payments-api/BankAccountMandateRepresentation.json";
import CardMandateRepresentationSchema from "@exness/payments-api/CardMandateRepresentation.json";
import ResolutionReasonSchema from "@exness/account-api/ResolutionReason.json";
import ProductSchema from "@exness/account-api/Product.json";

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

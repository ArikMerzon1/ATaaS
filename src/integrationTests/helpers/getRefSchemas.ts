import { ReferencedSchemas } from "@exness/emit-message";

import ClaimSchema from "@exness/account-api/Claim.json";
import DebtorSchema from "@exness/account-api/Debtor.json";
import RepaymentSchema from "@exness/account-api/Repayment.json";
import ClaimOriginationSchema from "@exness/account-api/ClaimOrigination.json";
import TestSuiteSchema from "../../apiMessages/TestSuite.json";

export default function getRefSchemas(): ReferencedSchemas {
  return {
    "TestSuite.json": TestSuiteSchema,
    "Claim.json": ClaimSchema,
    "Debtor.json": DebtorSchema,
    "Repayment.json": RepaymentSchema,
    "ClaimOrigination.json": ClaimOriginationSchema,
  };
}

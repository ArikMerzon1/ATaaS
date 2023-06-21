import { ReferencedSchemas } from "@receeve-gmbh/emit-message";

import ClaimSchema from "@receeve-gmbh/account-api/Claim.json";
import ProductSchema from "@receeve-gmbh/account-api/Product.json";

import DebtorSchema from "@receeve-gmbh/account-api/Debtor.json";
import RepaymentSchema from "@receeve-gmbh/account-api/Repayment.json";
import ClaimOriginationSchema from "@receeve-gmbh/account-api/ClaimOrigination.json";
import TestSuiteSchema from "../../apiMessages/TestSuite.json";

export default function getRefSchemas(): ReferencedSchemas {
  return {
    "TestSuite.json": TestSuiteSchema,
    "Claim.json": ClaimSchema,
    "Debtor.json": DebtorSchema,
    "Repayment.json": RepaymentSchema,
    "ClaimOrigination.json": ClaimOriginationSchema,
    "Product.json": ProductSchema,
  };
}

import RecurringPaymentMandate from "./RecurringPaymentMandate";
import { PaymentProvider } from "../utils/Enums";

export default interface IRecurringPaymentMandateDAO {
  get(clientId: string, accountId: string, mandateId: string): Promise<RecurringPaymentMandate | null>;

  upsert(recurringPaymentMandate: RecurringPaymentMandate): Promise<void>;

  updateInBatch(recurringPaymentMandates: RecurringPaymentMandate[]): Promise<void>;

  find(clientId: string, accountId: string, providerName?: PaymentProvider): Promise<RecurringPaymentMandate[]>;

  delete(clientId: string, accountId: string, mandateId: string): Promise<void>;
}

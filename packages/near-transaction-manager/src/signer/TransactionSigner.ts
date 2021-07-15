import { SignedTransaction, Transaction } from "near-api-js/lib/transaction";

export type SignTransactionOptions = {
  transaction: Transaction;
};

export interface TransactionSigner {
  sign(options: SignTransactionOptions): Promise<SignedTransaction>;
}

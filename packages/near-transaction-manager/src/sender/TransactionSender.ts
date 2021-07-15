import { FinalExecutionOutcome } from "near-api-js/lib/providers/provider";
import { SignedTransaction } from "near-api-js/lib/transaction";
import { CreateTransactionOptions, TransactionCreator } from "../creator/TransactionCreator";
import { TransactionSigner } from "../signer/TransactionSigner";

export type TransactionSendOptions = {
  transactionOptions: CreateTransactionOptions;
  transactionCreator: TransactionCreator;
  transactionSigner: TransactionSigner;
}

export type TransactionBundleSendOptions = {
  bundleTransactionOptions: CreateTransactionOptions[];
  transactionCreator: TransactionCreator;
  transactionSigner: TransactionSigner;
}

export interface TransactionSender {
  send(options: TransactionSendOptions): Promise<FinalExecutionOutcome>;
  bundleSend(options: TransactionBundleSendOptions): Promise<FinalExecutionOutcome[]>;
}
  
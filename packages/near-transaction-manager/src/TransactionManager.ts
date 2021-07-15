import { FinalExecutionOutcome } from "near-api-js/lib/providers/provider";
import { Transaction } from "near-api-js/lib/transaction";
import {
  CreateTransactionOptions,
  TransactionCreator,
} from "./creator/TransactionCreator";
import { TransactionSender } from "./sender/TransactionSender";
import { TransactionSigner } from "./signer/TransactionSigner";

interface TransactionManagerOptions {
  transactionCreator: TransactionCreator;
  transactionSigner: TransactionSigner;
  transactionSender: TransactionSender;
}

export default class TransactionManager {
  private transactionCreator: TransactionCreator;
  private transactionSigner: TransactionSigner;
  private transactionSender: TransactionSender;

  constructor({
    transactionCreator,
    transactionSigner,
    transactionSender,
  }: TransactionManagerOptions) {
    this.transactionCreator = transactionCreator;
    this.transactionSigner = transactionSigner;
    this.transactionSender = transactionSender;
  }

  createTransaction(options: CreateTransactionOptions): Promise<Transaction> {
    return this.transactionCreator.create(options);
  }

  async createSignedTransaction(options: CreateTransactionOptions) {
    const transaction = await this.createTransaction(options);
    return this.transactionSigner.sign({ transaction });
  }

  signAndSendTransaction(
    options: CreateTransactionOptions
  ): Promise<FinalExecutionOutcome> {
    return this.transactionSender.send({
      transactionOptions: options,
      transactionCreator: this.transactionCreator,
      transactionSigner: this.transactionSigner,
    });
  }

  signAndSendTransactions(
    options: CreateTransactionOptions[]
  ): Promise<FinalExecutionOutcome[]> {
    return this.transactionSender.bundleSend({
      bundleTransactionOptions: options,
      transactionCreator: this.transactionCreator,
      transactionSigner: this.transactionSigner,
    });
  }
}

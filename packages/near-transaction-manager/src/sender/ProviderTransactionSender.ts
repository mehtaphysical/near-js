import {
  FinalExecutionOutcome,
  Provider,
} from "near-api-js/lib/providers/provider";
import {
  TransactionBundleSendOptions,
  TransactionSender,
  TransactionSendOptions,
} from "./TransactionSender";

type ProviderTransactionSenderOptions = {
  provider: Provider;
};

export default class ProviderTransactionSender implements TransactionSender {
  private provider: Provider;

  constructor({ provider }: ProviderTransactionSenderOptions) {
    this.provider = provider;
  }

  async send({
    transactionOptions,
    transactionCreator,
    transactionSigner,
  }: TransactionSendOptions): Promise<FinalExecutionOutcome> {
    const transaction = await transactionCreator.create(transactionOptions);
    const signedTransaction = await transactionSigner.sign({ transaction });
    return this.provider.sendTransaction(signedTransaction);
  }

  async bundleSend({
    bundleTransactionOptions,
    transactionCreator,
    transactionSigner,
  }: TransactionBundleSendOptions): Promise<FinalExecutionOutcome[]> {
    const outcomes: FinalExecutionOutcome[] = [];

    for (let transactionOptions of bundleTransactionOptions) {
      outcomes.push(
        await this.send({
          transactionOptions,
          transactionCreator,
          transactionSigner,
        })
      );
    }

    return outcomes;
  }
}

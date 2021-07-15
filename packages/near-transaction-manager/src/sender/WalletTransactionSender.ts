import { WalletConnection } from "near-api-js";
import { FinalExecutionOutcome } from "near-api-js/lib/providers";
import {
  TransactionBundleSendOptions,
  TransactionSender,
  TransactionSendOptions,
} from "./TransactionSender";

type WalletTransactionSenderOptions = {
  wallet: WalletConnection;
};

export default class WalletTransactionSender implements TransactionSender {
  private wallet: WalletConnection;

  constructor({ wallet }: WalletTransactionSenderOptions) {
    this.wallet = wallet;
  }

  async send({
    transactionOptions,
  }: TransactionSendOptions): Promise<FinalExecutionOutcome> {
    return this.wallet.account().signAndSendTransaction({
      receiverId: transactionOptions.receiverId,
      actions: transactionOptions.actions,
    });
  }

  async bundleSend({
    bundleTransactionOptions,
    transactionCreator,
  }: TransactionBundleSendOptions): Promise<FinalExecutionOutcome[]> {
    const transactions = await Promise.all(
      bundleTransactionOptions.map((option) =>
        transactionCreator.create(option)
      )
    );
    await this.wallet.requestSignTransactions({ transactions });

    return [];
  }
}

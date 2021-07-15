import { WalletConnection } from "near-api-js";
import { FinalExecutionOutcome } from "near-api-js/lib/providers";
import {
  TransactionBundleSendOptions,
  TransactionSender,
  TransactionSendOptions,
} from "./TransactionSender";

export type WalletTransactionSenderOptions = {
  /**
   * A NEAR `WalletConnection` from 'near-api-js`.
   */
  wallet: WalletConnection;
};

/**
 * This is an implementation of {@link TransactionSender}. It is used to send
 * transactions by sending the to the NEAR wallet via redirect.
 *
 *
 * @example
 * ```ts
 * const transactionSender = new WalletTransactionSender({ wallet })
 * ```
 */
export class WalletTransactionSender implements TransactionSender {
  private wallet: WalletConnection;

  constructor({ wallet }: WalletTransactionSenderOptions) {
    this.wallet = wallet;
  }

  /**
   * @see {@link TransactionSender.send}
   */
  async send({
    transactionOptions,
  }: TransactionSendOptions): Promise<FinalExecutionOutcome> {
    // @ts-ignore
    return this.wallet.account().signAndSendTransaction({
      receiverId: transactionOptions.receiverId,
      actions: transactionOptions.actions,
    });
  }

  /**
   * @see {@link TransactionSender.bundleSend}
   */
  async bundleSend({
    bundleTransactionOptions,
    transactionCreator,
  }: TransactionBundleSendOptions): Promise<FinalExecutionOutcome[]> {
    const transactions = await Promise.all(
      bundleTransactionOptions.map((option, i) =>
        transactionCreator.create({ ...option, nonceOffset: i + 1 })
      )
    );
    await this.wallet.requestSignTransactions({ transactions });

    return [];
  }
}

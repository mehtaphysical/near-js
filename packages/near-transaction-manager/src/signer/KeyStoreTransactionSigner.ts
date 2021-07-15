import { KeyStore } from "near-api-js/lib/key_stores/keystore";
import { InMemorySigner, Signer } from "near-api-js/lib/signer";
import {
  SignedTransaction,
  signTransaction,
} from "near-api-js/lib/transaction";
import { SignTransactionOptions, TransactionSigner } from "./TransactionSigner";

type KeyStoreTransactionSignerOptions = {
  signerId: string;
  networkId: string;
  keyStore: KeyStore;
};

export default class KeyStoreTransactionSigner implements TransactionSigner {
  private signerId: string;
  private networkId: string;
  private keyStore: KeyStore;
  private signer: Signer;

  constructor({
    signerId,
    networkId,
    keyStore,
  }: KeyStoreTransactionSignerOptions) {
    this.signerId = signerId;
    this.networkId = networkId;
    this.keyStore = keyStore;
    this.signer = new InMemorySigner(keyStore);
  }

  async sign({
    transaction,
  }: SignTransactionOptions): Promise<SignedTransaction> {
    const [, signedTransaction] = await signTransaction(
      transaction,
      this.signer,
      this.signerId,
      this.networkId
    );
    return signedTransaction;
  }
}

import { JsonRpcProvider } from "near-api-js/lib/providers/json-rpc-provider";
import { KeyStore } from "near-api-js/lib/key_stores/keystore";
import { Transaction } from "near-api-js/lib/transaction";
import {
  AccessKeyInfoView,
  QueryResponseKind,
} from "near-api-js/lib/providers/provider";
import { CreateTransactionOptions, TransactionCreator } from "./TransactionCreator";

type KeyStoreTransactionCreatorOptions = {
  signerId: string;
  networkId: string;
  keyStore: KeyStore;
  nodeUrl: string;
};

export default class KeyStoreTransactionCreator implements TransactionCreator {
  private signerId: string;
  private networkId: string;
  private keyStore: KeyStore;
  private provider: JsonRpcProvider;

  constructor({
    signerId,
    networkId,
    keyStore,
    nodeUrl,
  }: KeyStoreTransactionCreatorOptions) {
    this.signerId = signerId;
    this.networkId = networkId;
    this.keyStore = keyStore;

    this.provider = new JsonRpcProvider(nodeUrl);
  }

  async create({
    receiverId,
    actions,
    nonceOffset = 1,
  }: CreateTransactionOptions): Promise<Transaction> {
    const keyPair = await this.keyStore.getKey(this.networkId, this.signerId);
    const publicKey = keyPair.getPublicKey();
    const { access_key, block_hash } = await this.provider.query<
      AccessKeyInfoView & QueryResponseKind
    >({
      request_type: "view_access_key",
      account_id: this.signerId,
      public_key: publicKey.toString(),
      finality: "optimistic",
    });

    return new Transaction({
      receiverId,
      actions,
      publicKey,
      signerId: this.signerId,
      nonce: access_key.nonce + nonceOffset,
      blockHash: block_hash,
    });
  }
}

import { KeyPair } from "near-api-js";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";
import { Provider } from "near-api-js/lib/providers";
import {
  AccessKeyWithPublicKey,
  BlockChangeResult,
  BlockId,
  BlockReference,
  BlockResult,
  ChangeResult,
  ChunkId,
  ChunkResult,
  EpochValidatorInfo,
  FinalExecutionOutcome,
  GasPrice,
  LightClientProof,
  LightClientProofRequest,
  NearProtocolConfig,
  NodeStatusResult,
} from "near-api-js/lib/providers/provider";
import { SignedTransaction } from "near-api-js/lib/transaction";
import { KeyStoreTransactionCreator } from "../creator";
import { KeyStoreTransactionSigner } from "../signer";

export class MockProvider implements Provider {
  async query() {
    return {
      public_key: "ed215519:helloKEY",
      access_key: {
        nonce: 345,
        permission: "FullAccess",
      },
      block_height: 1,
      block_hash: "abcd1234abcd1234abcd1234abcd1234",
    };
  }

  status(): Promise<NodeStatusResult> {
    throw new Error("NOOP");
  }

  sendTransaction(
    signedTransaction: SignedTransaction
  ): Promise<FinalExecutionOutcome> {
    throw new Error("NOOP");
  }

  sendTransactionAsync(
    signedTransaction: SignedTransaction
  ): Promise<FinalExecutionOutcome> {
    throw new Error("NOOP");
  }

  txStatus(
    txHash: Uint8Array | string,
    accountId: string
  ): Promise<FinalExecutionOutcome> {
    throw new Error("NOOP");
  }

  txStatusReceipts(
    txHash: Uint8Array,
    accountId: string
  ): Promise<FinalExecutionOutcome> {
    throw new Error("NOOP");
  }

  block(blockQuery: BlockId | BlockReference): Promise<BlockResult> {
    throw new Error("NOOP");
  }

  blockChanges(
    blockQuery: BlockId | BlockReference
  ): Promise<BlockChangeResult> {
    throw new Error("NOOP");
  }

  chunk(chunkId: ChunkId): Promise<ChunkResult> {
    throw new Error("NOOP");
  }

  validators(blockId: BlockId): Promise<EpochValidatorInfo> {
    throw new Error("NOOP");
  }

  experimental_genesisConfig(): Promise<NearProtocolConfig> {
    throw new Error("NOOP");
  }

  experimental_protocolConfig(
    blockReference: BlockReference
  ): Promise<NearProtocolConfig> {
    throw new Error("NOOP");
  }

  lightClientProof(
    request: LightClientProofRequest
  ): Promise<LightClientProof> {
    throw new Error("NOOP");
  }

  gasPrice(blockId: BlockId): Promise<GasPrice> {
    throw new Error("NOOP");
  }

  accessKeyChanges(
    accountIdArray: string[],
    BlockQuery: BlockId | BlockReference
  ): Promise<ChangeResult> {
    throw new Error("NOOP");
  }

  singleAccessKeyChanges(
    accessKeyArray: AccessKeyWithPublicKey[],
    BlockQuery: BlockId | BlockReference
  ): Promise<ChangeResult> {
    throw new Error("NOOP");
  }

  accountChanges(
    accountIdArray: string[],
    BlockQuery: BlockId | BlockReference
  ): Promise<ChangeResult> {
    throw new Error("NOOP");
  }

  contractStateChanges(
    accountIdArray: string[],
    BlockQuery: BlockId | BlockReference,
    keyPrefix: string
  ): Promise<ChangeResult> {
    throw new Error("NOOP");
  }

  contractCodeChanges(
    accountIdArray: string[],
    BlockQuery: BlockId | BlockReference
  ): Promise<ChangeResult> {
    throw new Error("NOOP");
  }
}

export const createTestKeyStore = (signerId = "my-acct.testnet") => {
  const keyPair = KeyPair.fromString(
    "ed25519:5eGhUdBAbie8EAQgJKj3hyuXb6pkVit21uWprBmJjDntPgRCCwprFDqtKv1B4EgqMUjtHmU5yj6t5R2jZx2vFRpN"
  );

  const keyStore = new InMemoryKeyStore();
  keyStore.setKey("testnet", signerId, keyPair);

  return keyStore;
};

export const createTestTransactionCreator = (signerId = "my-acct.testnet") => {
  return new KeyStoreTransactionCreator({
    keyStore: createTestKeyStore(signerId),
    signerId,
    networkId: "testnet",
    provider: new MockProvider(),
  });
};

export const createTestTranasctionSigner = (signerId = "my-acct.testnet") => {
  return new KeyStoreTransactionSigner({
    keyStore: createTestKeyStore(signerId),
    signerId,
    networkId: "testnet",
  });
};

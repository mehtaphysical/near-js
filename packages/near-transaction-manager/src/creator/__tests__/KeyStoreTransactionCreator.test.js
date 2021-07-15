const { createAccount } = require("near-api-js/lib/transaction");
const { KeyStoreTransactionCreator } = require("../KeyStoreTransactionCreator");
const { InMemoryKeyStore } = require("near-api-js/lib/key_stores");
const { KeyPair } = require("near-api-js");
const { MockProvider } = require("../../test-helpers/helpers");

describe("KeyStoreTransactionCreator", () => {
  let creator;
  let keyPair;
  beforeEach(() => {
    keyPair = KeyPair.fromRandom("ed25519");

    const keyStore = new InMemoryKeyStore();
    keyStore.setKey("testnet", "my-acct.testnet", keyPair);

    creator = new KeyStoreTransactionCreator({
      keyStore,
      signerId: "my-acct.testnet",
      networkId: "testnet",
      provider: new MockProvider(),
    });
  });

  it("creates a transaction", async () => {
    const transaction = await creator.create({
      receiverId: "test.testnet",
      actions: [createAccount()],
    });
    expect(transaction).toEqual({
      actions: [createAccount()],
      blockHash: "abcd1234abcd1234abcd1234abcd1234",
      nonce: 346,
      publicKey: keyPair.getPublicKey(),
      receiverId: "test.testnet",
      signerId: "my-acct.testnet",
    });
  });

  it("creates a transaction with nonceOffset", async () => {
    const transaction = await creator.create({
      receiverId: "test.testnet",
      actions: [createAccount()],
      nonceOffset: 10,
    });
    expect(transaction).toEqual({
      actions: [createAccount()],
      blockHash: "abcd1234abcd1234abcd1234abcd1234",
      nonce: 355,
      publicKey: keyPair.getPublicKey(),
      receiverId: "test.testnet",
      signerId: "my-acct.testnet",
    });
  });
});

const { createAccount } = require("near-api-js/lib/transaction");
const {
  createTestKeyStore,
  createTestTransactionCreator,
} = require("../../test-helpers/helpers");
const { KeyStoreTransactionSigner } = require("../KeyStoreTransactionSigner");

describe("KeyStoreTransactionSigner", () => {
  it("signs a transaction useing a KeyStore", async () => {
    const creator = createTestTransactionCreator();

    const signer = new KeyStoreTransactionSigner({
      keyStore: createTestKeyStore(),
      signerId: "my-acct.testnet",
      networkId: "testnet",
    });

    const transaction = await creator.create({
      receiverId: "test.testnet",
      actions: [createAccount()],
    });

    const signedTransaction = await signer.sign({ transaction });

    expect(signedTransaction).toEqual({
      transaction,
      signature: {
        data: new Uint8Array([
          22, 176, 95, 80, 93, 154, 103, 43, 26, 248, 118, 225, 194, 143, 118,
          112, 177, 215, 72, 239, 26, 189, 52, 245, 50, 56, 41, 72, 1, 96, 222,
          36, 182, 72, 177, 150, 195, 63, 40, 66, 197, 4, 6, 240, 17, 173, 45,
          18, 188, 27, 36, 207, 242, 157, 29, 82, 37, 150, 6, 189, 198, 48, 115,
          13,
        ]),
        keyType: 0,
      },
    });
  });
});

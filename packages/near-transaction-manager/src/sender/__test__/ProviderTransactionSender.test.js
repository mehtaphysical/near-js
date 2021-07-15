const { createAccount } = require("near-api-js/lib/transaction");
const {
  createTestTransactionCreator,
  createTestTranasctionSigner,
  MockProvider,
} = require("../../test-helpers/helpers");
const { ProviderTransactionSender } = require("../ProviderTransactionSender");

describe("ProviderTransactionSender", () => {
  it("sends a transaction using a provider", async () => {
    const provider = new MockProvider();
    provider.sendTransaction = jest.fn();

    const sender = new ProviderTransactionSender({
      provider,
    });

    const transactionCreator = createTestTransactionCreator();
    const transactionSigner = createTestTranasctionSigner();

    await sender.send({
      transactionCreator,
      transactionSigner,
      transactionOptions: {
        receiverId: "test.testnet",
        actions: [createAccount()],
      },
    });

    expect(provider.sendTransaction).toHaveBeenCalledTimes(1);
  });

  it("sends a bundle of transactions using a provider", async () => {
    const provider = new MockProvider();
    provider.sendTransaction = jest.fn(() => Promise.resolve());

    const sender = new ProviderTransactionSender({
      provider,
    });

    const transactionCreator = createTestTransactionCreator();
    const transactionSigner = createTestTranasctionSigner();

    await sender.bundleSend({
      transactionCreator,
      transactionSigner,
      bundleTransactionOptions: [
        {
          receiverId: "test.testnet",
          actions: [createAccount()],
        },
        {
          receiverId: "test.testnet",
          actions: [createAccount()],
        },
        {
          receiverId: "test.testnet",
          actions: [createAccount()],
        },
      ],
    });

    expect(provider.sendTransaction).toHaveBeenCalledTimes(3);
    
    expect(provider.sendTransaction).toHaveBeenNthCalledWith(1, {
      signature: expect.anything(),
      transaction: expect.objectContaining({ nonce: 346 }),
    });
    expect(provider.sendTransaction).toHaveBeenNthCalledWith(2, {
      signature: expect.anything(),
      transaction: expect.objectContaining({ nonce: 347 }),
    });
    expect(provider.sendTransaction).toHaveBeenNthCalledWith(3, {
      signature: expect.anything(),
      transaction: expect.objectContaining({ nonce: 348 }),
    });
  });
});

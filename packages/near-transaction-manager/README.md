# NEAR TransactionManager

This library is a utility for creating, signing, and sending transactions. Currently it is a wrapper around `near-api-js`.

See the docs: [https://near-transaction-manager.netlify.app/](https://near-transaction-manager.netlify.app/)

## Getting Started

1. install the library from npm: `npm i near-transaction-manager`
2. create a `TransactionManager` instance:

```ts
// create a TransactionManager from a NEAR Account
const transactionManager = TransactionManager.fromAccount(account);
```

or

```ts
// create a TransactionManager from a NEAR WalletConnection
const transactionManager = TransactionManager.fromWallet(wallet);
```

or

```ts
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const transactionManager = new TransactionManager({
  transactionCreator: new KeyStoreTransactionCreator({
    keyStore,
    signerId: wallet.getAccountId(),
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
  }),
  transactionSigner: new KeyStoreTransactionSigner({
    keyStore,
    signerId: wallet.getAccountId(),
    networkId: "testnet",
  }),
  transactionSender: new ProviderTransactionSender({
    provider: new JsonRpcProvider("https://rpc.testnet.near.org"),
  }),
});
```

3. use the `createTransaction`, `createSignedTransaction`, `signAndSendTransaction`, and `signAndSendTransactions` methods:

```ts
// create a transaction
const transaction = await transactionManager.createTransaction({
  receiverId: "example.testnet",
  actions: [functionCall("method", {}, DEFAULT_FUNCTION_CALL_GAS, [])],
});

// create a signed transaction
const signedTransaction = await transactionManager.createSignedTransaction({
  receiverId: "example.testnet",
  actions: [functionCall("method", {}, DEFAULT_FUNCTION_CALL_GAS, [])],
});

// create, sign, and send a transaction
const outcome = await transactionManager.createSignAndSendTransaction({
  receiverId: "example.testnet",
  actions: [functionCall("method", {}, DEFAULT_FUNCTION_CALL_GAS, [])],
});

// create, sign, and send many transactions
const outcomes = await transactionManager.bundleCreateSignAndSendTransactions([
  {
    receiverId: "example.testnet",
    actions: [functionCall("method1", {}, DEFAULT_FUNCTION_CALL_GAS, [])],
  },
  {
    receiverId: "example.testnet",
    actions: [functionCall("method2", {}, DEFAULT_FUNCTION_CALL_GAS, [])],
  },
  {
    receiverId: "example.testnet",
    actions: [functionCall("method3", {}, DEFAULT_FUNCTION_CALL_GAS, [])],
  },
  {
    receiverId: "example.testnet",
    actions: [functionCall("method4", {}, DEFAULT_FUNCTION_CALL_GAS, [])],
  },
]);
```

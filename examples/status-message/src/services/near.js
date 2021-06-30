import { keyStores, Near, WalletConnection } from "near-api-js";

export const CONTRACT_ID =
  process.env.CONTRACT_ID || "near-playground-199354545.testnet";

const near = new Near({
  networkId: process.env.NEAR_NETWORK_ID || "testnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: process.env.NEAR_NODE_URL || "https://rpc.testnet.near.org",
  walletUrl: process.env.NEAR_WALLET_URL || "https://wallet.testnet.near.org",
});

export const getWallet = () => new WalletConnection(near, "status-message");

export const viewGetStatus = () => {
  const wallet = getWallet();
  return wallet.account().viewFunction(CONTRACT_ID, "get_status", {
    account_id: wallet.getAccountId(),
  });
};

export const callSetStatus = (message) => {
  const wallet = getWallet();
  return wallet.account().functionCall({
    contractId: CONTRACT_ID,
    methodName: "set_status",
    args: {
      message,
    },
  });
};

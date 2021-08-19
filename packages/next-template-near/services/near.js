import { Near, KeyPair, utils, Account } from "near-api-js";
import BN from "bn.js";

const keyStore = {
  getKey() {
    return KeyPair.fromString(process.env.NEAR_PRIVATE_KEY);
  },
  setKey() {},
};

export const near = new Near({
  keyStore,
  nodeUrl: process.env.NEXT_PUBLIC_NEAR_NODE_URL,
});

export const nearAccount = new Account(
  near.connection,
  process.env.NEAR_ACCOUNT_ID
);

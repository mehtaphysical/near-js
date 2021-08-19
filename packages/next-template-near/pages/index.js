import React, { useEffect } from "react";
import { useNear, useNearWallet, useNearContract } from "near-react-hooks";

export default function Home() {
  const near = useNear();
  const wallet = useNearWallet();
  const contract = useNearContract("dev-123457824879", {
    viewMethods: ["getCount"],
    changeMethods: ["decrement", "increment"],
  });

  useEffect(() => {
    if (!wallet.isSignedIn()) wallet.requestSignIn();
  }, []);

  if (!wallet.isSignedIn()) return null;

  return <h1>{wallet.getAccountId()}</h1>;
}

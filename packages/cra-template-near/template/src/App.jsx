import React, { useEffect } from "react";
import { NearSignin } from "near-react-hooks";

export default function App() {
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

  return <NearSignin contractId="wrap.near" />;
}

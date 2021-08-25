import React, { useEffect, useState } from "react";
import { NearSignin, useNearContract, useNearWallet } from "near-react-hooks";

export default function App() {
  const wallet = useNearWallet();
  const contract = useNearContract("counter.react.testnet", {
    changeMethods: ["decrement", "increment", "reset"],
    viewMethods: ["get_num"],
  });

  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  const getBalance = async () => {
    const balance = await contract.get_num();
    setBalance(balance);
  };

  const decrement = async () => {
    setLoading(true);

    await contract.decrement();
    await getBalance();

    setLoading(false);
  };

  const increment = async () => {
    setLoading(true);

    await contract.increment();
    await getBalance();

    setLoading(false);
  };

  const reset = async () => {
    setLoading(true);

    await contract.reset();
    await getBalance();

    setLoading(false);
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <section style={{ textAlign: "center" }}>
      <h1>Thanks for using CRA-Template-NEAR!</h1>
      <NearSignin
        contractId="counter.react.testnet"
        methodNames={["decrement", "increment", "reset"]}
      />
      <p>Current Number: {loading ? "loading..." : balance}</p>

      {!wallet.isSignedIn() ? null : (
        <>
          <button onClick={decrement}>Decrement</button>
          <button onClick={increment}>Increment</button>
          <button onClick={reset}>Reset</button>
        </>
      )}
    </section>
  );
}

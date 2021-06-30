import React, { useEffect, useState } from "react";
import {
  viewGetStatus,
  callSetStatus,
  getWallet,
  CONTRACT_ID,
} from "../services/near";

const wallet = getWallet();

export default function App() {
  const [status, setStatus] = useState();
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    viewGetStatus().then((status) => setStatus(status));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const functionCallResult = await callSetStatus(newStatus);
    setStatus(
      JSON.parse(
        Buffer.from(functionCallResult.status.SuccessValue, "base64").toString()
      )
    );
    setNewStatus("");
  };

  if (!wallet.isSignedIn()) {
    wallet.requestSignIn(CONTRACT_ID);
    return null;
  }

  return (
    <>
      <h1>Current Status: {status || "No Status"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New status"
          value={newStatus}
          onChange={({ target }) => setNewStatus(target.value)}
        />
        <button>Set Status</button>
      </form>
    </>
  );
}

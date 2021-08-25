# Create React App NEAR Template

This template is used to create a NEAR front-end using [Create React App](https://create-react-app.dev/). It comes with [near-react-hooks](https://github.com/mehtaphysical/near-react-hooks).

## Getting Started

To get started use this template with [Create React App](https://create-react-app.dev/) `npx create-react-app --template near my-app`.

## Usage Tutorial

1. create a NEAR Account
2. create a new React app using `cra-template-near`
3. create a landing page for users to signin
4. add a form to the landing page to wrap NEAR
5. display the wrapped NEAR balance
6. add an unwrap NEAR feature to the form

### 1. Create a NEAR Account

Checkout the official docs to get started creating a NEAR account [here](https://docs.near.org/docs/develop/basics/create-account).

### 2. Create a React Application

The `cra-template-near` Create React App template sets up a React application preconfigured with [near-react-hooks](https://github.com/mehtaphysical/near-react-hooks).

To start your project type `npx create-react-app --template near wrap-near-app` into a terminal. This will create a new directory `wrap-near-app` based on `cra-template-near` (see [Selecting a template](https://create-react-app.dev/docs/getting-started#selecting-a-template)).

### 3. Create a landing page

To create a landing page we'll edit `src/App.js` placing a signin button onto the page.

```jsx
import React from "react";
import { NearSignin } from "near-react-hooks";

export default function App() {
  return (
    <NearSignin
      contractId="wrap.testnet"
      methods={["near_deposit", "near_withdraw"]}
    />
  );
}
```

- **Line 2** - import the `NearSignin` button from [near-react-hooks](https://github.com/mehtaphysical/near-react-hooks).
- **Line 6-9** - render the `NearSignin` button onto the page

### 4. Wrap NEAR on form submit

Next we'll add a form to wrap NEAR.

```jsx
import React, { useState } from "react";
import { NearSignin, useNearContract } from "near-react-hooks";
import { utils } from "near-api-js";

export default function App() {
  const [amount, setAmount] = useState("0");

  const contract = useNearContract("wrap.testnet", {
    changeMethods: ["near_deposit"],
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    contract.near_deposit({
      args: {},
      amount: utils.format.parseNearAmount(amount),
    });
  };

  return (
    <>
      <NearSignin
        contractId="wrap.testnet"
        methods={["near_deposit", "near_withdraw"]}
      />
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={amount}
          onChange={({ target }) => setAmount(target.value)}
        />
        <button>Wrap NEAR</button>
      </form>
    </>
  );
}
```

- **Line 8-10** - define a NEAR smart contract interface
- **Line 26-33** - form to collect the amount of NEAR to wrap from user input
- **Line 14-17** - call the `near_deposit` method attaching `amount` of NEAR for wrapping

### 5. View wrapped balance on mount

```jsx
import React, { useEffect, useState } from "react";
import { NearSignin, useNearContract, useNearWallet } from "near-react-hooks";
import { utils } from "near-api-js";

export default function App() {
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("0");

  const wallet = useNearWallet();
  const accountId = wallet.getAccountId();
  const contract = useNearContract("wrap.testnet", {
    changeMethods: ["near_deposit"],
    viewMethods: ["ft_balance_of"],
  });

  useEffect(() => {
    contract
      .ft_balance_of({ account_id: accountId })
      .then((balance) => utils.format.formatNearAmount(balance))
      .then(setBalance);
  }, [contract, accountId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    contract.near_deposit({
      args: {},
      amount: utils.format.parseNearAmount(amount),
    });
  };

  return (
    <>
      <NearSignin
        contractId="wrap.testnet"
        methods={["near_deposit", "near_withdraw"]}
      />
      <p>Current Wrapped Balance: {balance}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={amount}
          onChange={({ target }) => setAmount(target.value)}
        />
        <button>Wrap NEAR</button>
      </form>
    </>
  );
}
```

- **Line 13** - add `ft_balance_of` to the contract interface
- **Line 16-21** - call the `ft_balance_of` method passing the `account_id` argument
- **Line 19** - receive the wrapped NEAR balance and convert yoctoNEAR to NEAR.
- **Line 37** - display the balance

### 6. Unwrap NEAR on form submit

```jsx
import React, { useEffect, useState } from "react";
import { NearSignin, useNearContract, useNearWallet } from "near-react-hooks";
import { utils } from "near-api-js";

export default function App() {
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("0");
  const [method, setMethod] = useState("wrap");

  const wallet = useNearWallet();
  const accountId = wallet.getAccountId();
  const contract = useNearContract("wrap.testnet", {
    changeMethods: ["near_deposit", "near_withdraw"],
    viewMethods: ["ft_balance_of"],
  });

  useEffect(() => {
    contract
      .ft_balance_of({ account_id: accountId })
      .then((balance) => utils.format.formatNearAmount(balance))
      .then(setBalance);
  }, [contract, accountId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (method === "wrap") {
      contract.near_deposit({
        args: {},
        amount: utils.format.parseNearAmount(amount),
      });
    }

    if (method === "unwrap") {
      contract.near_withdraw({
        args: {
          amount: utils.format.parseNearAmount(amount),
        },
        amount: 1,
      });
    }
  };

  return (
    <>
      <NearSignin
        contractId="wrap.testnet"
        methods={["near_deposit", "near_withdraw"]}
      />
      <p>Current Wrapped Balance: {balance}</p>
      <form onSubmit={handleSubmit}>
        <select
          defaultValue={method}
          onChange={({ target }) => setMethod(target.value)}
        >
          <option value="wrap">Wrap NEAR</option>
          <option value="unwrap">Unwrap NEAR</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={({ target }) => setAmount(target.value)}
        />
        <button>{method} NEAR</button>
      </form>
    </>
  );
}
```

- **Line 13** - add `near_withdraw` to the contract interface
- **Line 24-41** - check if wrap or unwrap is selected then call either `near_deposit` or `near_withdraw`

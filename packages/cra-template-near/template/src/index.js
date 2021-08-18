import React from "react";
import { render } from "react-dom";
import { NearProvider, NearEnvironment } from "near-react-hooks";
import App from "./App";

render(
  <NearProvider environment={NearEnvironment.TestNet}>
    <App />
  </NearProvider>,
  document.getElementById("root")
);

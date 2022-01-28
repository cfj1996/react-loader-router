import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
// import App from "./App";
import AppRouter from "./routes";
import { SWRConfig } from "swr";

const cacheMap = new Map();
// @ts-ignore
window.cacheMap = cacheMap;
ReactDOM.render(
  <SWRConfig value={{ provider: () => cacheMap }}>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </SWRConfig>,
  document.getElementById("root")
);

import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes";
import "./index.css";
import { SWRConfig } from "swr";

function localStorageProvider() {
  // 初始化时，我们将数据从 `localStorage` 恢复到一个 map 中。
  const map = new Map(JSON.parse(sessionStorage.getItem("app-cache") || "[]"));

  // 在卸载 app 之前，我们将所有数据写回 `localStorage` 中。
  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    sessionStorage.setItem("app-cache", appCache);
  });

  // 我们仍然使用 map 进行读写以提高性能。
  return map;
}
ReactDOM.render(
  <SWRConfig value={{}}>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </SWRConfig>,
  document.getElementById("root")
);

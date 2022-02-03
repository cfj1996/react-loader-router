import React from "react";
import { setToken } from "../utils/token";

function Index() {
  return (
    <div>
      Index 页面
      <button
        onClick={() => {
          setToken("123");
        }}
      >
        登陆
      </button>
    </div>
  );
}
export default Index;

import * as React from "react";
import { useRoutes } from "react-router-dom";
import RootLayout from "./layouts/root";
import Index from "./page/index";
import Home from "./page/home";
import User from "./page/user";
import UserXq from "./page/userXq";

const routes2 = [
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        title: "欢迎来到。。。",
        element: <Index />
      },
      {
        path: "home",
        title: "首页",
        element: <Home />
      },
      {
        path: "user",
        children: [
          {
            title: "用户list",
            index: true,
            element: <User />
          },

          {
            title: "用户详情",
            path: ":id",
            element: <UserXq />
          }
        ]
      }
    ]
  }
];
export default function App() {
  return useRoutes(routes2);
}

// import { loaderLazy, RouteObject, useRoutes } from "react-loader-router";
import RootLayout from "./layouts/root";
import { loaderLazy, RouteObject, useRoutes } from "../../../src";
import { getNavs, getUser, getUsers } from "./server";
import { createSearchParams } from "react-router-dom";

const routes: RouteObject[] = [
  {
    component: RootLayout,
    async loader(params) {
      console.log("params1", params);
      return await getNavs();
    },
    routers: [
      {
        index: true,
        title: "欢迎来到。。。",
        component: loaderLazy(() => import("./page/index"))
      },
      {
        path: "home",
        title: "首页",
        component: loaderLazy(() => import("./page/home"))
      },
      {
        path: "user",
        routers: [
          {
            index: true,
            title: "用户列表",
            component: loaderLazy(() => import("./page/user")),
            async loader(params) {
              const searchParams = createSearchParams(params.searchString!);
              return await getUsers({
                page: searchParams.get("page") || "1",
                per_page: searchParams.get("per_page") || "5"
              });
            }
          },
          {
            path: ":id",
            title: "用户详情",
            component: loaderLazy(() => import("./page/userXq")),
            async loader(params) {
              console.log(params);
              return await getUser("1");
            }
          }
        ]
      }
    ]
  }
];

export default function AppRouter() {
  return useRoutes(routes);
}

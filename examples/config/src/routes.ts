import RootLayout from "./layouts/root";
import { loaderLazy, RouteObject, useRoutes } from "react-loader-router";
import { getNavs, getUser, getUsers } from "./server";
import { createSearchParams } from "react-router-dom";
import { Loading } from "./Loading";

const routes: RouteObject[] = [
  {
    component: RootLayout,
    Fallback: Loading,
    async loader() {
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
            Fallback: Loading,
            async loader(params) {
              const searchParams = createSearchParams(params?.searchString);
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
            Fallback: Loading,
            async loader(params) {
              return await getUser(params?.params?.id || "1");
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

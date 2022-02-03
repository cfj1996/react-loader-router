> 基于react-router@6.2.1 swr@1.2.0的Suspense的预加载路由库react-loader-router

# 一.项目使用
1.入口文件main.tsx
```tsx
  <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
```
2. 路由配置文件routes.ts
```tsx
import RootLayout from "./layouts/root";
import { loaderLazy, RouteObject, useRoutes } from "../../../src";
import { getNavs, getUser, getUsers } from "./server";
import { createSearchParams } from "react-router-dom";
import { Loading } from "./Loading";
// 
import { Error } from "./Error";
// 页面拦截组件，参考umi的路由的wrappers
import { UserWrapper } from "./UserWrapper";

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
        wrappers: [UserWrapper],
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
            FallbackErr: Error,
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
            FallbackErr: Error,
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

```

3.页面中使用user.tsx
```tsx
// 不需要关注加载状态和错误处理
const { data } = useLoaderData();
```

# 二.API介绍

## `useRoutes()`
```ts
type useRoutes = (routes: RouteObject, locationArg?: Partial<Location> | string) => React.ReacrNode

```
## `RouteObject`

```ts

interface RouteObject<T = any> {
  caseSensitive?: boolean; // react-router@6
  routers?: RouteObject<T>[]; // 嵌套路由
  component?: LoaderComponentType; // 页面请用loaderLazy方法包裹下
  index?: boolean; // react-router@6
  path?: string; // react-router@6
  title?: string; // 页面的标题
  wrappers?: React.ComponentType<any>[]; // 页面拦截组件
  loader?: Loader<T>; // 页面所需要的数据的 返回Promise, 所有的参数从url上获取
  Fallback?: React.ComponentType; // 页面loading 组件
  FallbackErr?: React.ComponentType<{ error: any }>; // 页面错误组件
}

```

## useLoaderData.ts
```ts
// 获取对应路由component上的loader数据
type useLoaderData = (config?: SWRConfiguration) => ({data, mutate})

```

## usePrefetch.ts

```ts
// 预加载页面和页面上的数据
type usePrefetch = () => (to: To)=> Promise
const fetch = usePrefetch();
fetch('/user/1')
```

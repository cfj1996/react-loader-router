import { Params, resolvePath, useRoutes as useARoutes } from "react-router-dom";
import * as React from "react";
import { Location } from "history";
import { withError } from "./ErrorBoundary";

export type LoaderParams = {
  searchString?: string;
  params?: Params;
};
export type Loader<T = any> = (params: LoaderParams) => Promise<T>;
export type LoaderComponentType = React.ComponentType & {
  loader?: Loader;
  fetch?: Fetch;
};
export type Fetch = () => Promise<{ default: LoaderComponentType }>;
export const RouteOptionsContext = React.createContext<null | MainRouteObject>(
  null
);
export const RoutesContext = React.createContext<null | MainRouteObject[]>(
  null
);
export const useRouteOption = function (): MainRouteObject {
  return React.useContext(RouteOptionsContext)!;
};
export const useGetRoutes = function () {
  return React.useContext(RoutesContext)!;
};
export interface RouteObject<T = any> {
  caseSensitive?: boolean;
  routers?: RouteObject<T>[];
  component?: LoaderComponentType;
  index?: boolean;
  path?: string;
  title?: string;
  access?: string;
  wrappers?: React.ComponentType[];
  loader?: Loader<T>;
  Fallback?: React.ComponentType;
  FallbackErr?: React.ComponentType;
}

export const useRoutes = function (
  routes: RouteObject[],
  locationArg?: Partial<Location> | string
) {
  const mainRoutes = loopRoutes(routes, "$_root", "/");
  console.log("mainRoutes", mainRoutes);
  return (
    <RoutesContext.Provider value={mainRoutes}>
      {useARoutes(mainRoutes, locationArg)}
    </RoutesContext.Provider>
  );
};

export interface MainRouteObject<T = any> extends RouteObject<T> {
  id: string;
  absPath: string;
  isLayout?: boolean;
  parentId: string;
  loaderData?: T;
  fetchLoaderData?: Loader<T>;
  children?: MainRouteObject<T>[];
  element?: React.ReactNode;
  asyncComponent?: LoaderComponentType;
  fetchComponent?: Fetch;
}

function loopRoutes(
  routes: RouteObject[],
  parentId: string,
  parentAbsPath?: string
): MainRouteObject[] {
  return routes.map(route => {
    const isLayout = !route.index && route.path === undefined;
    let id;
    if (isLayout) {
      id = resolvePath("./", parentId).pathname;
    } else {
      if (route.index) {
        id = resolvePath("$_index", parentId).pathname;
      } else {
        id = resolvePath(route.path!, parentId).pathname;
      }
    }
    const absPath = resolvePath(route.path || "", parentAbsPath).pathname;
    const mainRoute: MainRouteObject = {
      ...route,
      id,
      absPath,
      isLayout,
      parentId,
      fetchComponent: () => {
        if (!mainRoute.asyncComponent && route.component?.fetch) {
          return route.component.fetch().then(res => {
            mainRoute.asyncComponent = res.default;
            if (res.default.loader) {
              mainRoute.loader = res.default.loader;
            }
            return res;
          });
        } else {
          return Promise.resolve({ default: React.Fragment });
        }
      },
      fetchLoaderData: arg => {
        if (mainRoute.loader && !mainRoute.loaderData) {
          return mainRoute.loader(arg).then(res => {
            mainRoute.loaderData = res;
            return res;
          });
        } else {
          return Promise.resolve(mainRoute.loaderData);
        }
      },
      children: route.routers
        ? loopRoutes(route.routers, id, absPath)
        : undefined
    };
    mainRoute.element = route.component ? (
      <RouteComponent mainRoute={mainRoute} />
    ) : undefined;
    return mainRoute;
  });
}

function RouteComponent(props: { mainRoute: MainRouteObject }) {
  const { component, title, access, wrappers, Fallback } = props.mainRoute;
  React.useEffect(() => {
    if (title) {
      document.title = title;
    }
  });
  const fallback = Fallback ? React.createElement(Fallback) : "加载中...";
  const childrenComponent = component
    ? withError(createWrapperTree(wrappers, component, props))
    : undefined;
  return (
    <RouteOptionsContext.Provider value={props.mainRoute}>
      <React.Suspense fallback={fallback}>{childrenComponent}</React.Suspense>
    </RouteOptionsContext.Provider>
  );
}
function createWrapperTree<T>(
  arr: React.ComponentType[] | undefined,
  Component: React.ComponentType,
  props: T
): React.ComponentType {
  return function WrapperTree() {
    if (arr?.length) {
      return arr.reduceRight((element, item) => {
        return React.createElement(item, props, element);
      }, React.createElement(Component, props));
    } else {
      return React.createElement(Component, props);
    }
  };
}

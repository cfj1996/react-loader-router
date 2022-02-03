import { Params, resolvePath, useRoutes as useARoutes } from "react-router-dom";
import * as React from "react";
import { Location } from "history";
import { withError } from "./ErrorBoundary";

export type LoaderParams = {
  searchString?: string;
  params?: Params;
};
export type Loader<T = any> = (params?: LoaderParams) => Promise<T>;
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
  wrappers?: React.ComponentType<any>[];
  loader?: Loader<T>;
  Fallback?: React.ComponentType;
  FallbackErr?: React.ComponentType<{ error: any }>;
}
type RouteMap = Map<
  string,
  { asyncComponent?: LoaderComponentType; loaderData?: any }
>;
const RouteMapContext = React.createContext<RouteMap | null>(null);
export const useRouteMap = function () {
  return React.useContext(RouteMapContext)!;
};
export const useRoutes = function (
  routes: RouteObject[],
  locationArg?: Partial<Location> | string
) {
  const routeMapRef = React.useRef<RouteMap>(new Map());
  const mainRoutes = loopRoutes(routes, "_root", "/");
  return (
    <RoutesContext.Provider value={mainRoutes}>
      <RouteMapContext.Provider value={routeMapRef.current}>
        {useARoutes(mainRoutes, locationArg)}
      </RouteMapContext.Provider>
    </RoutesContext.Provider>
  );
};

export interface MainRouteObject<T = any> extends RouteObject<T> {
  id: string;
  absPath: string;
  isLayout?: boolean;
  parentId: string;
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
        id = resolvePath("_index", parentId).pathname;
      } else {
        id = resolvePath(route.path!, parentId).pathname;
      }
    }
    const absPath = resolvePath(route.path || "", parentAbsPath).pathname;
    const ErrorBoundary = withError();
    const element = route.component ? (
      <ErrorBoundary FallbackErr={route.FallbackErr}>
        <RouteComponent
          {...route}
          id={id}
          absPath={absPath}
          isLayout={isLayout}
          parentId={parentId}
        />
      </ErrorBoundary>
    ) : undefined;
    const mainRoute: MainRouteObject = {
      ...route,
      id,
      absPath,
      isLayout,
      parentId,
      element,
      fetchComponent: route.component?.fetch,
      children: route.routers
        ? loopRoutes(route.routers, id, absPath)
        : undefined
    };
    return mainRoute;
  });
}

function RouteComponent(props: MainRouteObject) {
  const { component, title, wrappers, Fallback, id, FallbackErr } = props;
  const routeMap = useRouteMap();
  const renderComponent = routeMap.get(id)?.asyncComponent || component!;
  React.useEffect(() => {
    if (title) {
      document.title = title;
    }
  });
  const fallback = Fallback
    ? React.createElement(Fallback, props as any)
    : "加载中...";
  const children = createWrapperTree(wrappers, renderComponent, props);
  return (
    <RouteOptionsContext.Provider value={props}>
      <React.Suspense fallback={fallback}>{children}</React.Suspense>
    </RouteOptionsContext.Provider>
  );
}
function createWrapperTree<T>(
  arr: React.ComponentType[] | undefined,
  Component: React.ComponentType,
  props: T
) {
  if (arr?.length) {
    return arr.reduceRight((element, item) => {
      return React.createElement(item, props, element);
    }, React.createElement(Component, props));
  } else {
    return React.createElement(Component, props);
  }
}

import {
  LoaderParams,
  MainRouteObject,
  useGetRoutes,
  useRouteOption
} from "./useRoutes";
import {
  matchPath,
  matchRoutes,
  resolvePath,
  To,
  useHref,
  useLocation
} from "react-router-dom";

export const usePrefetch = function (to: To) {
  const href = useHref(to);
  const url = new URL(window.location.host + href);
  const location = useLocation();
  const absPath = resolvePath(to, location.pathname);
  const routes = useGetRoutes();
  const matches = matchRoutes(routes, absPath) || [];
  const routerOption = useRouteOption();
  return function () {
    return Promise.all([
      matches.map(item => {
        const route = item.route as MainRouteObject;
        const matchParams = matchPath(route.absPath, absPath.pathname);
        const loaderParams: LoaderParams = {
          params: matchParams ? matchParams.params : undefined,
          searchString:
            url.search &&
            matches.length &&
            matches[matches.length - 1].route === routerOption
              ? url.search
              : undefined
        };
        return Promise.all([
          route.fetchComponent?.(),
          route.fetchLoaderData?.(loaderParams)
        ]);
      })
    ]);
  };
};

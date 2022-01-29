import {
  LoaderParams,
  MainRouteObject,
  useGetRoutes,
  useRouteMap
} from "./useRoutes";
import { matchPath, matchRoutes, resolvePath, To } from "react-router-dom";
import * as React from "react";

export const usePrefetch = function () {
  const isFetch = React.useRef(false);
  const routes = useGetRoutes();
  const routeMap = useRouteMap();
  return function (to: To) {
    const absPath = resolvePath(to, window.location.pathname);
    const matches = matchRoutes(routes, absPath) || [];
    if (isFetch.current) return Promise.resolve();
    return Promise.all([
      matches.map((item, index) => {
        const route = item.route as MainRouteObject;
        const matchParams = matchPath(item.pathname, absPath.pathname);
        let loaderParams: LoaderParams | undefined;
        if (
          (matchParams && Object.keys(matchParams.params).length) ||
          (absPath.search && matches.length)
        ) {
          loaderParams = {};
          if (matchParams && Object.keys(matchParams.params).length) {
            loaderParams.params = matchParams.params;
          }
          if (
            absPath.search &&
            matches.length &&
            index === matches.length - 1
          ) {
            loaderParams.searchString = absPath.search;
          }
        }
        const key = loaderParams ? [route.id, loaderParams] : route.id;
        return Promise.all([
          route.fetchComponent?.().then(res => {
            const data = routeMap.get(route.id) || {};
            if (res && !data?.asyncComponent) {
              data.asyncComponent = res.default;
              routeMap.set(route.id, data);
            }
          }),
          route.loader?.(loaderParams).then(res => {
            const data = routeMap.get(route.id) || {};
            data.loaderData = res;
            routeMap.set(route.id, data);
            // return mutate(key, res);
          })
        ]);
      })
    ]).finally(() => {
      isFetch.current = true;
    });
  };
};

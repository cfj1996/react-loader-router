import useSWR from "swr";
import { LoaderParams, useGetRoutes, useRouteOption } from "./useRoutes";
import { matchPath, matchRoutes, useLocation } from "react-router-dom";

export const useLoaderData = function () {
  const routerOption = useRouteOption();
  const routes = useGetRoutes();
  const location = useLocation();
  const matches = matchRoutes(routes, location) || [];
  const matchParams = matchPath(routerOption.absPath, location.pathname);
  const loaderParams: LoaderParams = {
    params: matchParams ? matchParams.params : undefined,
    searchString:
      location.search &&
      matches.length &&
      matches[matches.length - 1].route === routerOption
        ? location.search
        : undefined
  };
  return useSWR(
    [routerOption.id, loaderParams],
    routerOption.loader
      ? (id: string, params: LoaderParams) => routerOption.loader?.(params)
      : null,
    {
      suspense: true,
      fallbackData: routerOption.loaderData
    }
  );
};

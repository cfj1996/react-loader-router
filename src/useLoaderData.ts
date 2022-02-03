import useSWR, { SWRConfiguration } from "swr";
import { LoaderParams, useRouteMap, useRouteOption } from "./useRoutes";
import { matchPath, useLocation, useParams } from "react-router-dom";

export const useLoaderData = function (config?: SWRConfiguration) {
  const params = useParams();
  const routerOption = useRouteOption();
  const location = useLocation();
  const matchParams = matchPath(routerOption.absPath, location.pathname);
  const routeMap = useRouteMap();
  let loaderParams: LoaderParams | undefined = undefined;
  if (Object.keys(params).length || (location.search && matchParams)) {
    loaderParams = {};
    if (Object.keys(params).length) {
      loaderParams.params = params;
    }
    if (location.search && matchParams) {
      loaderParams.searchString = location.search;
    }
  }
  const key = loaderParams ? [routerOption.id, loaderParams] : routerOption.id;
  const { data, mutate } = useSWR(
    key,
    routerOption.loader
      ? (id: string, params?: LoaderParams) => routerOption.loader?.(params)
      : null,
    {
      suspense: true,
      fallbackData: routeMap.get(routerOption.id)?.loaderData,
      ...config
    }
  );
  return { data, mutate };
};

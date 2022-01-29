import useSWR, {
  SWRConfiguration,
  unstable_serialize,
  useSWRConfig
} from "swr";
import { LoaderParams, useRouteMap, useRouteOption } from "./useRoutes";
import { matchPath, useLocation, useParams } from "react-router-dom";

export const useLoaderData = function (config?: SWRConfiguration) {
  const params = useParams();
  const { cache } = useSWRConfig();
  const routerOption = useRouteOption();
  const location = useLocation();
  const matchParams = matchPath(routerOption.absPath, location.pathname);
  console.log("matchParams", matchParams);
  const routeMap = useRouteMap();
  console.log("routerOption", routerOption);
  console.log("/user----", matchPath("/user/:id", "/user/2/list"));
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
  console.log(
    "swr-key-get",
    key,
    [...(cache as Map<string, any>).keys()].includes(unstable_serialize(key))
  );
  return useSWR(
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
};

import * as React from "react";
import { Fetch, LoaderComponentType } from "./useRoutes";

export const loaderLazy: (fn: Fetch) => LoaderComponentType = function (fn) {
  const component = React.lazy(fn) as LoaderComponentType;
  component.fetch = fn;
  return component;
};

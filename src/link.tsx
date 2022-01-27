import { Link as RouteLink, LinkProps } from "react-router-dom";
import * as React from "react";
import { FC } from "react";

export const Link: FC<LinkProps> = function (props) {
  return <RouteLink {...props} />;
};

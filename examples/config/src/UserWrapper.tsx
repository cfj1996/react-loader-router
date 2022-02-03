import React, { FC } from "react";
import { Navigate } from "react-router-dom";
import useSWR from "swr";
import { getToken } from "./utils/token";

export const UserWrapper: FC<any> = function (props) {
  const { data } = useSWR("/isLogin", getToken, {
    suspense: true
  });
  if (data) {
    return props.children as React.ReactElement;
  }
  return <Navigate to={"/"} replace />;
};

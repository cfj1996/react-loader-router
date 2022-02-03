/**
 * @name: ErrorBoundary
 * @user: cfj
 * @date: 2022/1/8
 * @description:
 */

import type { PropsWithChildren } from "react";
import * as React from "react";

export function withError() {
  return class ErrorBoundary extends React.Component<
    PropsWithChildren<{ FallbackErr?: React.ComponentType<any> }>
  > {
    state = {
      error: null,
      showError: false
    };
    componentDidCatch(error: any) {
      this.setState({ error });
    }
    render() {
      const { error } = this.state;
      if (error) {
        if (this.props.FallbackErr) {
          return React.createElement(this.props.FallbackErr, {
            error: error
          });
        } else {
          return <p>页面错误</p>;
        }
      }
      return this.props.children;
    }
  };
}

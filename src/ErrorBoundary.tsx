/**
 * @name: ErrorBoundary
 * @user: cfj
 * @date: 2022/1/8
 * @description:
 */

import type { ComponentType, PropsWithChildren } from "react";
import * as React from "react";

export function withError(component: ComponentType) {
  class ErrorBoundary extends React.Component<PropsWithChildren<any>> {
    state = {
      error: null,
      showError: false,
      errorComplete: null
    };
    componentDidCatch(error: any) {
      this.setState({ error });
    }
    render() {
      const { error } = this.state;
      if (error) {
        React.createElement(this.props.FallbackErr || "", {
          error: error
        });
      }
      return this.props.children;
    }
  }
  return <ErrorBoundary>{React.createElement(component)}</ErrorBoundary>;
}

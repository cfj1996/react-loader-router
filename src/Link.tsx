import * as React from "react";
import { Link as ALink, LinkProps as ALinkProps } from "react-router-dom";
import { usePrefetch } from "./usePrefetch";

type LinkProps = ALinkProps & { prefetch?: boolean; target?: "hover" | "auto" };
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function (
  props,
  ref
) {
  const { prefetch, target = "hover", ...other } = props;
  const fetch = usePrefetch(other.to);
  React.useEffect(() => {
    if (target === "auto") {
      prefetch && fetch();
    }
  }, []);
  return (
    <ALink
      ref={ref}
      {...other}
      onMouseOver={
        target === "hover"
          ? () => {
              prefetch && fetch();
            }
          : undefined
      }
    />
  );
});

import { Outlet } from "react-router-dom";
import React from "react";
import { Link, useLoaderData } from "../../../../src";
import { useSWRConfig } from "swr";

export default function RootLayout() {
  const { data } = useLoaderData() as any;
  const { cache } = useSWRConfig();
  return (
    <div>
      <ul className={"nav"}>
        {data.map((item: any) => (
          <li key={item.path} className={"nav-item"}>
            <Link to={item.path} prefetch>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

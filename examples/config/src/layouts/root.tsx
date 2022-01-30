import { Outlet } from "react-router-dom";
import React from "react";
import { Link, useLoaderData } from "react-loader-router";
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
        <li className={"nav-item"}>
          <button
            onClick={() => {
              console.log("cache keys", (cache as Map<string, any>).keys());
            }}
          >
            get cache
          </button>
        </li>
      </ul>

      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

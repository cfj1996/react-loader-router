import { Outlet } from "react-router-dom";
import React from "react";
import { Link, useLoaderData } from "../../../../src";

export default function RootLayout() {
  const { data } = useLoaderData() as any;
  return (
    <div>
      <ul style={{ display: "flex", listStyle: "none" }}>
        {data.map((item: any) => (
          <li key={item.path} style={{ padding: "0 15px" }}>
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

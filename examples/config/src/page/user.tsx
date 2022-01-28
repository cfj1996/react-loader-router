import React from "react";
import { Link, useLoaderData } from "../../../../src";
import { useSearchParams } from "react-router-dom";

function User() {
  const { data } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const params: any = {};
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  const page = searchParams.get("page") || "1";
  searchParams.values();
  return (
    <div>
      <p>用户列表</p>
      {data.data.map((item: any) => {
        return (
          <p key={item.id}>
            id: {item.id}, name:{" "}
            <Link to={`./${item.id}`}>{item.first_name}</Link>
          </p>
        );
      })}
      <div>
        <Link
          to={"?page=1&per_page=5"}
          prefetch
          style={{ padding: "0 15px", margin: "0 5px" }}
        >
          1
        </Link>
        <Link
          to={"?page=2&per_page=5"}
          prefetch
          style={{ padding: "0 15px", margin: "0 5px" }}
        >
          2
        </Link>
        <Link
          to={"?page=3&per_page=5"}
          prefetch
          style={{ padding: "0 15px", margin: "0 5px" }}
        >
          3
        </Link>
      </div>
    </div>
  );
}
export default User;

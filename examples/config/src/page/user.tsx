import React from "react";
import { Link, useLoaderData } from "react-loader-router";

function User() {
  const { data } = useLoaderData();
  return (
    <div>
      <p>用户列表</p>
      {data?.data.map((item: any) => {
        return (
          <p key={item.id}>
            id: {item.id}, name:{" "}
            <Link to={`./${item.id}`} prefetch>
              {item.first_name}
            </Link>
          </p>
        );
      })}
      <div className={"pagination"}>
        <Link to={"?page=1&per_page=5"} prefetch className={"pagination-item"}>
          1
        </Link>
        <Link to={"?page=2&per_page=5"} prefetch className={"pagination-item"}>
          2
        </Link>
        <Link to={"?page=3&per_page=5"} prefetch className={"pagination-item"}>
          3
        </Link>
      </div>
    </div>
  );
}
export default User;

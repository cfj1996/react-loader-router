import React from "react";
import { useLoaderData } from "../../../../src";

function UserXq() {
  const { data } = useLoaderData();
  return (
    <div>
      <h3>用户详情</h3>
      <div>
        <img src={data.data.avatar} alt={data.data.first_name} />
      </div>
      <p>email: {data.data.email}</p>
      <p>first_name: {data.data.first_name}</p>
      <p>id: {data.data.id}</p>
    </div>
  );
}
export default UserXq;

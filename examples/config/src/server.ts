const deaTime = function (time: number, value: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value);
    }, time);
  });
};

export function getNavs() {
  return Promise.resolve([
    {
      name: "首页index",
      path: "/"
    },
    {
      name: "home",
      path: "/home"
    },
    {
      name: "user",
      path: "/user?page=1&per_page=5"
    }
  ]).then(res => deaTime(1500, res));
}
export function getUsers(data: { page: string; per_page: string }) {
  // return deaTime(1500, 1).then(() => Promise.reject(new Error("error")));
  return fetch(
    `https://reqres.in/api/users?page=${data.page}&per_page=${data.per_page}`
  )
    .then(date => date.json())
    .then(res => deaTime(1500, res));
}
export function getUser(id: string) {
  return fetch(`https://reqres.in/api/users/${id}`)
    .then(date => date.json())
    .then(res => deaTime(1500, res));
}

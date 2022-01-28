export function getNavs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
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
          path: "/user"
        }
      ]);
    }, 2000);
  });
}
export function getUsers(data: { page: string; per_page: string }) {
  return fetch(
    `https://reqres.in/api/users?page=${data.page}&per_page=${data.per_page}`
  ).then(date => date.json());
}
export function getUser(id: string) {
  return fetch(`https://reqres.in/api/users/${id}`).then(date => date.json());
}

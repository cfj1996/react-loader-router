/**
 * @name: token
 * @user: cfj
 * @date: 2022/1/9
 * @description:
 */
import { mutate } from 'swr';

export const HeadersKey = 'token';
export const setToken = function (token: string) {
  window.localStorage.setItem(HeadersKey, token);
  return mutate('/isLogin', token);
};
export const getToken = function () {
  return window.localStorage.getItem(HeadersKey) || '';
};
export const removeToken = function () {
  getToken() && window.localStorage.removeItem(HeadersKey);
  return mutate('/isLogin', undefined);
};

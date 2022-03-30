import axios from "axios";
import { logout } from "../helpers/api";
import { getToken } from "../helpers/common";

const http = axios.create();

http.interceptors.request.use((config) => {
  config.headers["Authorization"] = `Bearer ${getToken("accessToken")}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;
    if (status === 401) {
      logout();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default http;

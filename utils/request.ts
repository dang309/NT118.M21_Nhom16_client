import axios from "axios";
import ASYNC_STORAGE from "../storage";

const request = axios.create({
  baseURL: "https://api-nhom16.herokuapp.com/v1",
  // baseURL: "http://localhost:5000/v1",
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    // if (!config.url?.startsWith("/auth/")) {
    //   Object.assign(config, {
    //     headers: {
    //       Authorization: `Bearer ${
    //         // ASYNC_STORAGE.GET("user").tokens.access.token
    //       }`,
    //     },
    //   });
    // }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

request.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default request;

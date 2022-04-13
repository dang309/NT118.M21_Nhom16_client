import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const request = axios.create({
  baseURL: "https://api-nhom16.herokuapp.com/v1",
  // baseURL: "https://10.0.2.2:3000/v1",
  timeout: 100000,
});

request.interceptors.request.use(
  async (config) => {
    const headers = { "Content-Type": "application/json", ...config.headers };
    if (!config.url?.startsWith("/auth/")) {
      let tokens = await AsyncStorage.getItem("@tokens");
      if (!tokens?.length) return;
      const _tokens = JSON.parse(tokens);
      Object.assign(headers, {
        Authorization: `Bearer ${_tokens.access.token}`,
      });
    }
    Object.assign(config, { headers });
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

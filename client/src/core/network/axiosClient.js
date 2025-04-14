import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const client = axios.create({
  withCredentials: true,
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  async (config) => {
    config.timeout = 120000;
      return config;
  },
  async (error) => {
    return await Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      return client(prevRequest);
    }
    return Promise.reject(error);
  }
);

export default client;

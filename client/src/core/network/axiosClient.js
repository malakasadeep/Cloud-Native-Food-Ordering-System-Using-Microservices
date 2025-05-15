import axios from "axios";

const gatewayBaseURL = import.meta.env.VITE_API_GATEWAY_URL;

const servicePaths = {
  default: "",
  user: "/api/users",
  restaurant: "/api/restaurants",
  notification: "/api/notification",
  order: "/api/orders",
  delivery: "/api/delivery",
};

const createServiceClient = (serviceName) => {
  const baseURL = gatewayBaseURL;
  const servicePath = servicePaths[serviceName] || "";

  const serviceClient = axios.create({
    withCredentials: true,
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  serviceClient.interceptors.request.use(
    async (config) => {
      config.timeout = 120000;
      // Prepend the service path to the request URL
      if (servicePath && !config.url.startsWith(servicePath)) {
        config.url = `${servicePath}${config.url}`;
      }
      return config;
    },
    async (error) => {
      return await Promise.reject(error);
    }
  );

  serviceClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const prevRequest = error?.config;
      if (error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        return serviceClient(prevRequest);
      }
      return Promise.reject(error);
    }
  );

  return serviceClient;
};
const client = createServiceClient("default");

export { createServiceClient };
export default client;

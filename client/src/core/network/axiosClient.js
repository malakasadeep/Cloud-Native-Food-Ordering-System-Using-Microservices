import axios from "axios";

const defaultBaseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const serviceURLs = {
  default: defaultBaseURL,
  user: import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:5001",
  restaurant: import.meta.env.VITE_ORDER_SERVICE_URL || "http://localhost:5002",
  order: import.meta.env.VITE_PAYMENT_SERVICE_URL || "http://localhost:5003",
  delever: import.meta.env.VITE_CATALOG_SERVICE_URL || "http://localhost:5004",
  
};

const createServiceClient = (serviceName) => {
  const baseURL = serviceURLs[serviceName] || defaultBaseURL;
  
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

// Create the default client (for backward compatibility)
const client = createServiceClient('default');

// Export the service client factory and the default client
export { createServiceClient };
export default client;

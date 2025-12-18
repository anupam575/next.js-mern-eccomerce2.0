import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000/api/v1";

console.log("🔗 Using API Base URL:", BASE_URL);

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};
console.log("refresh tokn dund4", API.interceptors.response);
console.log("refresh tokn dund6");

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.log("refresh tokn dund");

    const originalRequest = error.config;

    // 🪵 Step 1: Log every error response
    console.log("⚠️ API Error caught:", {
      url: originalRequest?.url,
      status: error.response?.status,
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔐 Access token expired — trying refresh token...");

      // 🪵 Step 2: Avoid infinite loop on refresh route itself
      if (originalRequest.url.includes("/refresh-token")) {
        console.log("🚫 Refresh token also failed. Redirecting to login...");
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      // 🪵 Step 3: Handle multiple failed requests while refreshing
      if (isRefreshing) {
        console.log("⏳ Already refreshing token. Queuing request...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => API(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("♻️ Calling /refresh-token endpoint...");
        const refreshResponse = await API.get(
          "/refresh-token",
          {},
          {
            headers: { "Cache-Control": "no-cache" },
          }
        );
        console.log("refresh tokn dund3");

        console.log("✅ Refresh successful:", refreshResponse.data);
        processQueue(null);
        return API(originalRequest);
      } catch (refreshError) {
        console.error(
          "❌ Refresh token request failed:",
          refreshError.response?.data
        );
        processQueue(refreshError);

        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;

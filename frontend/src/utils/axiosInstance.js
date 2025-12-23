
"use client";

import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000/api/v1";

console.log("🔗 Using API Base URL:", BASE_URL);

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // cookies automatically sent
});

// ---------- Token Refresh Queue Handling ----------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  console.log("🔄 Processing queued requests, error:", error);
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// ---------- Response Interceptor ----------
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("⚠️ API error caught:", error.response?.status, originalRequest.url);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Prevent infinite loop on refresh-token request
      if (originalRequest.url.includes("/refresh-token")) {
        console.log("🚫 Refresh token failed, redirecting to login");
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        console.log("⏳ Token refresh already in progress, queuing request");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => API(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        console.log("♻️ Calling /refresh-token endpoint...");
        const refreshResponse = await API.get("/refresh-token"); // no custom header

        console.log("✅ Refresh token response:", refreshResponse.data);

        processQueue(null); // Retry all queued requests
        return API(originalRequest); // Retry original request
      } catch (refreshError) {
        processQueue(refreshError); // Reject all queued requests

        if (typeof window !== "undefined") {
          console.log("🔴 Redirecting to login due to refresh failure");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        console.log("⏹ Token refresh process finished");
      }
    }

    return Promise.reject(error);
  }
);

export default API;

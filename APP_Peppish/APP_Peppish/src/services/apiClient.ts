import axios, { AxiosInstance } from "axios";
import { ApiError } from "../types";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const createApiClient = (): AxiosInstance => {
  const envRaw = import.meta.env.VITE_API_URL ?? "";
  const raw = typeof envRaw === "string" && envRaw.trim() !== "" ? envRaw : "";
  const normalized = String(raw).replace(/\/$/, "");
  const baseURL =
    normalized === ""
      ? "/api"
      : normalized.endsWith("/api")
        ? normalized
        : `${normalized}/api`;

  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    if (authToken) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${authToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        authToken = null;
        try {
          window.location.href = "/login";
        } catch (e) {
          // ignore in non-browser environments
        }
      }
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || "UNKNOWN_ERROR",
        status: error.response?.status || 500,
        details: error.response?.data?.message || error.response?.data || "",
      };
      return Promise.reject(apiError);
    },
  );

  return instance;
};

export const apiClient = createApiClient();

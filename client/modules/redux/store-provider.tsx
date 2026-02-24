"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { getItem, setItem } from "./local-storage-service";
import { setUser, removeUser } from "@/modules/auth/server/user-slice";
import { refreshAccessToken } from "@/modules/auth/server/auth-service";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Hydrate the user state after initial render to safeguard SSR hydration matching
    const storedUser = getItem("user");
    if (storedUser) {
      store.dispatch(setUser(storedUser));
    }

    const reqInterceptor = axios.interceptors.request.use((config) => {
      const user = getItem("user");
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    });

    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Only attempt refresh on 401 and if we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Skip refresh for auth endpoints themselves
          const url = originalRequest.url || "";
          if (
            url.includes("/users/login") ||
            url.includes("/users/register") ||
            url.includes("/users/refresh-token")
          ) {
            return Promise.reject(error);
          }

          if (isRefreshing) {
            // Queue this request while another refresh is in progress
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          const user = getItem("user");
          if (!user?.refreshToken) {
            // No refresh token available, logout
            store.dispatch(removeUser());
            isRefreshing = false;
            if (typeof window !== "undefined") window.location.href = "/login";
            return Promise.reject(error);
          }

          try {
            const data = await refreshAccessToken(user.refreshToken);
            const updatedUser = {
              ...user,
              token: data.token,
              refreshToken: data.refreshToken,
            };
            store.dispatch(setUser(updatedUser));
            processQueue(null, data.token);

            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            store.dispatch(removeUser());
            if (typeof window !== "undefined") window.location.href = "/login";
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
};


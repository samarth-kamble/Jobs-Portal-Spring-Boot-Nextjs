"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { getItem } from "./local-storage-service";
import { setUser } from "@/modules/auth/server/user-slice";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Hydrate the user state after initial render to safeguard SSR hydration matching
    const storedUser = getItem("user");
    if (storedUser) {
      store.dispatch(setUser(storedUser));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

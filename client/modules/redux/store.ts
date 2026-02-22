import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/modules/auth/server/user-slice";
import profileReducer from "@/modules/landing/server/profile-slice";

import filterReducer from "@/modules/redux/filter-slice";
import sortReducer from "@/modules/redux/sort-slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
    filter: filterReducer,
    sort: sortReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { api } from "./rtk";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // api
    [api.reducerPath]: api.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

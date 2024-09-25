import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from "./AuthStore";
import { coordinateApi } from "./CoordinateStore";
import userReducer from "./../slices/UserSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [coordinateApi.reducerPath]: coordinateApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(coordinateApi.middleware),
});

setupListeners(store.dispatch);
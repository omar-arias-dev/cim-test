import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000";
const LOGIN = "login";
const CHANGE_PASSWORD = "change/password";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    login: builder.query({
      query: (userData) => {
        return ({
          method: "POST",
          url: `/${LOGIN}`,
          body: userData,
        });
      }
    }),
    changePassword: builder.mutation({
      query: (form) => {
        return ({
          method: "POST",
          url: `/${CHANGE_PASSWORD}`,
          body: form,
        });
      }
    }),
  }),
});

export const {
  useLazyLoginQuery,
  useChangePasswordMutation,
} = authApi;
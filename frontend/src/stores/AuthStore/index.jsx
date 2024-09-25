import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000";
const LOGIN = "login";

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
  }),
});

export const {
  useLazyLoginQuery,
} = authApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000";
const LOGIN = "login";
const CHANGE_PASSWORD = "password/change";
const USERS = "users";
const USER = "user";
const UPDATE = "equisde/update";
const CREATE = "equisde/create";

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
    allUsers: builder.query({
      query: () => {
        return ({
          method: "GET",
          url: `/${USERS}`,
        });
      }
    }),
    deleteUser: builder.mutation({
      query: (body) => {
        return ({
          method: "DELETE",
          url: `/${USER}`,
          body
        });
      }
    }),
    updateUser: builder.mutation({
      query: (body) => {
        return ({
          method: "POST",
          url: `/${UPDATE}`,
          body
        });
      }
    }),
    createUser: builder.mutation({
      query: (body) => {
        return ({
          method: "POST",
          url: `/${CREATE}`,
          body
        });
      }
    }),
  }),
});

export const {
  useLazyLoginQuery,
  useChangePasswordMutation,
  useLazyAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
} = authApi;
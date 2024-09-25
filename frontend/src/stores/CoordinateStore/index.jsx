import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000";
const COORDINATE = "coordinate";

export const coordinateApi = createApi({
  reducerPath: "coordinateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getCoordinates: builder.mutation({
      query: (token) => {
        return ({
          method: "POST",
          url: `/${COORDINATE}`,
          body: token,
        });
      }
    }),
  }),
});

export const {
  useGetCoordinatesMutation,
} = coordinateApi;
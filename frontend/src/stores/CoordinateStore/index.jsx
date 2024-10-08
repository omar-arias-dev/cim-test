import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000";
const COORDINATE = "coordinate";
const PAGINATED = "paginated";
const DOWNLOAD = "download";

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
    getCoordinatesPaginated: builder.mutation({
      query: (body) => {
        return ({
          method: "POST",
          url: `/${COORDINATE}/${PAGINATED}`,
          body,
        });
      }
    }),
    getCoordinatesPaginatedExcel: builder.mutation({
      query: (body) => {
        return ({
          method: "POST",
          url: `/${COORDINATE}/${PAGINATED}/${DOWNLOAD}`,
          body,
        });
      }
    }),
  }),
});

export const {
  useGetCoordinatesMutation,
  useGetCoordinatesPaginatedMutation,
  useGetCoordinatesPaginatedExcelMutation,
} = coordinateApi;
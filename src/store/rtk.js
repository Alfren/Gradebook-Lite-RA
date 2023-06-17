import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000" }),
  endpoints: (builder) => ({
    // ------- STUDENTS ------//
    getStudents: builder.query({
      query: () => `/students`,
    }),
    createStudent: builder.mutation({
      query: (name) => ({
        url: `/students`,
        method: "POST",
        body: { name },
      }),
    }),
    // ------- GRADES ------//
    getGrades: builder.query({
      query: () => `/grades`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useGetGradesQuery,
} = api;

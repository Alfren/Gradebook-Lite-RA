import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000" }),
  endpoints: (builder) => ({
    // ------- STUDENTS ------//
    getStudents: builder.query({
      query: () => `/students`,
      providesTags: ["students"],
    }),
    createStudent: builder.mutation({
      query: (name) => ({
        url: `/students`,
        method: "POST",
        body: { name, grades: {} },
      }),
      invalidatesTags: ["students"],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["students"],
    }),
    // ------- ASSIGNMENTS ------//
    getAssignments: builder.query({
      query: () => `/assignments`,
      providesTags: ["assignments"],
    }),
    createAssignment: builder.mutation({
      query: (title) => ({
        url: `/assignments`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: ["assignments"],
    }),
    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["assignments"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useDeleteStudentMutation,
  useGetAssignmentsQuery,
  useCreateAssignmentMutation,
  useDeleteAssignmentMutation,
} = api;

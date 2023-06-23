import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === "development"
        ? "http://localhost:4000/api"
        : "http://gradebook.us-east-1.elasticbeanstalk.com/api",
  }),
  endpoints: (builder) => ({
    // ------- STUDENTS ------//
    getStudents: builder.query({
      query: (teacherId) => `/students/${teacherId}`,
      providesTags: ["students"],
    }),
    createStudent: builder.mutation({
      query: (body) => ({
        url: `/students`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["students"],
    }),
    updateStudent: builder.mutation({
      query: ({ id, body }) => ({
        url: `/students/${id}`,
        method: "PATCH",
        body,
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
      query: (teacherId) => `/assignments/${teacherId}`,
      providesTags: ["assignments"],
    }),
    createAssignment: builder.mutation({
      query: (body) => ({
        url: `/assignments`,
        method: "POST",
        body: body,
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
    // ------- TEACHER ------//
    getTeacher: builder.mutation({
      query: (user) => `/teachers/${user}`,
      providesTags: ["teacher"],
    }),
    createTeacher: builder.mutation({
      query: (body) => ({
        url: "/teachers",
        method: "POST",
        body,
      }),
    }),
    deleteAccount: builder.mutation({
      query: (teacherId) => ({
        url: `/teachers/complete/${teacherId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetAssignmentsQuery,
  useCreateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetTeacherMutation,
  useCreateTeacherMutation,
  useDeleteAccountMutation,
} = api;

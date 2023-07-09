import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const connection =
  window.location.origin !== "http://localhost:3000"
    ? "http://192.168.1.4:4000/api"
    : "http://localhost:4000/api";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === "development"
        ? connection
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
      invalidatesTags: ["students", "classes"],
    }),
    updateStudent: builder.mutation({
      query: ({ id, body }) => ({
        url: `/students/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["students", "classes"],
    }),
    deleteStudent: builder.mutation({
      query: ({ id, classId }) => ({
        url: `/students/${id}/class/${classId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["students", "classes"],
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
      invalidatesTags: ["assignments", "classes"],
    }),
    deleteAssignment: builder.mutation({
      query: ({ id, classId }) => ({
        url: `/assignments/${id}/class/${classId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["assignments", "classes"],
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
      invalidatesTags: ["teacher"],
    }),
    deleteAccount: builder.mutation({
      query: (teacherId) => ({
        url: `/teachers/complete/${teacherId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["teacher"],
    }),
    // ------- CLASS ------//
    getTeacherClasses: builder.query({
      query: (teacherId) => `/classes/${teacherId}`,
      providesTags: (resp) =>
        resp
          ? ["classes", ...resp.map((item) => `classes-${item.id}`)]
          : ["classes"],
    }),
    createClass: builder.mutation({
      query: (body) => ({
        url: `/classes`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["classes"],
    }),
    deleteClass: builder.mutation({
      query: ({ id, teacherId }) => ({
        url: `/classes/${id}/${teacherId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["classes"],
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
  useGetTeacherClassesQuery,
  useCreateClassMutation,
  useDeleteClassMutation,
} = api;

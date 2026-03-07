import { apiSlice } from "./apiSlice";

export const projectArchiveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getArchivedProjects: builder.query({
      query: () => ({
        url: "/project/archive",
        method: "GET",
      }),
      providesTags: ["Project"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetArchivedProjectsQuery } = projectArchiveApiSlice;

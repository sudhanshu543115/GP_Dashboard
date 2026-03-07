import { apiSlice } from "./apiSlice";
import { toast } from "../../utils/toast";

const PROJECTS_URL = "project";

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: ({ page = 1, limit = 1000, search = "", status = "" } = {}) => ({
        url: PROJECTS_URL,
        params: { page, limit, search, status },
      }),
      transformResponse: (response) => response,
      providesTags: (result) =>
        Array.isArray(result?.data)
          ? [
              { type: "Project", id: "LIST" },
              ...result.data.map((project) => ({ type: "Project", id: project._id })),
            ]
          : [{ type: "Project", id: "LIST" }],
      keepUnusedDataFor: 5,
    }),

    getProjectById: builder.query({
      query: (id) => `${PROJECTS_URL}/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, arg) => [{ type: "Project", id: result?._id || arg }],
    }),

    getPublicLiveProjects: builder.query({
      query: ({ page = 1, limit = 1000 } = {}) => ({
        url: `${PROJECTS_URL}/public/live`,
        params: { page, limit },
      }),
      transformResponse: (response) => response,
      providesTags: [{ type: "Project", id: "PUBLIC_LIVE" }],
    }),

    addProject: builder.mutation({
      query: (data) => ({
        url: PROJECTS_URL,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Creating project...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "Project created successfully" });
        } catch (err) {
          toast.update(tid, { type: "error", message: err?.error?.data?.message || "Failed to create project" });
        }
      },
      invalidatesTags: [{ type: "Project", id: "LIST" }, { type: "Project", id: "PUBLIC_LIVE" }],
    }),

    updateProject: builder.mutation({
      query: ({ _id, data }) => ({
        url: `${PROJECTS_URL}/${_id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Updating project...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "Project updated successfully" });
        } catch (err) {
          toast.update(tid, { type: "error", message: err?.error?.data?.message || "Failed to update project" });
        }
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id: arg._id },
        { type: "Project", id: "PUBLIC_LIVE" },
      ],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `${PROJECTS_URL}/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Deleting project...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "Project deleted successfully" });
        } catch (err) {
          toast.update(tid, { type: "error", message: err?.error?.data?.message || "Failed to delete project" });
        }
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id: arg },
        { type: "Project", id: "PUBLIC_LIVE" },
      ],
    }),

    incrementProjectApplications: builder.mutation({
      query: (id) => ({
        url: `${PROJECTS_URL}/${id}/applications`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Updating applications...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "Applications updated successfully" });
        } catch (err) {
          toast.update(tid, { type: "error", message: err?.error?.data?.message || "Failed to update applications" });
        }
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id: arg },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetPublicLiveProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useIncrementProjectApplicationsMutation,
} = projectApiSlice;

import { apiSlice } from "./apiSlice";
import { toast } from "../../utils/toast";

const USERS_URL = "users/";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: USERS_URL,
        params: { page, limit },
      }),
      transformResponse: (response) => {
        if (response?.message?.users) return response.message;
        if (response?.data?.users) return response.data;
        if (Array.isArray(response?.users)) return response;
        return { users: [], pagination: null };
      },
      keepUnusedDataFor: 5,
    }),

    addUser: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Creating user...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "User created successfully" });
        } catch (err) {
          toast.update(tid, {
            type: "error",
            message: err?.error?.data?.message || "Failed to create user",
          });
        }
      },
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Updating user...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "User updated successfully" });
        } catch (err) {
          toast.update(tid, {
            type: "error",
            message: err?.error?.data?.message || "Failed to update user",
          });
        }
      },
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Deleting user...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "User deleted successfully" });
        } catch (err) {
          toast.update(tid, {
            type: "error",
            message: err?.error?.data?.message || "Failed to delete user",
          });
        }
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;

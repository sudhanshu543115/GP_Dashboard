import { apiSlice } from "./apiSlice";
import { toast } from "../../utils/toast";

const LEADS_URL = "leads";

export const leadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query({
      query: () => ({ url: LEADS_URL }),
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],
      keepUnusedDataFor: 5,
    }),

    getLeadById: builder.query({
      query: (id) => ({ url: `${LEADS_URL}/${id}` }),
      transformResponse: (response) => response?.data ?? null,
      keepUnusedDataFor: 5,
    }),

    addLead: builder.mutation({
      query: (data) => ({
        url: `${LEADS_URL}/`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Creating lead...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "Lead created successfully" });
        } catch (err) {
          toast.update(tid, {
            type: "error",
            message: err?.error?.data?.message || "Failed to create lead",
          });
        }
      },
    }),

    updateLead: builder.mutation({
      query: ({ id, data }) => ({
        url: `${LEADS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Updating lead...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "Lead updated successfully" });
        } catch (err) {
          toast.update(tid, {
            type: "error",
            message: err?.error?.data?.message || "Failed to update lead",
          });
        }
      },
    }),

    deleteLead: builder.mutation({
      query: (id) => ({
        url: `${LEADS_URL}/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Deleting lead...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "Lead deleted successfully" });
        } catch (err) {
          toast.update(tid, {
            type: "error",
            message: err?.error?.data?.message || "Failed to delete lead",
          });
        }
      },
    }),

    updateLeadStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${LEADS_URL}/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Updating lead status...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "Lead status updated" });
        } catch (err) {
          toast.update(tid, {
            type: "error",
            message: err?.error?.data?.message || "Failed to update lead status",
          });
        }
      },
    }),

    assignLead: builder.mutation({
      query: ({ id, assignedTo }) => ({
        url: `${LEADS_URL}/${id}/assign`,
        method: "PUT",
        body: { assignedTo },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Assigning lead...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "Lead assigned successfully" });
        } catch (err) {
          toast.update(tid, {
            type: "error",
            message: err?.error?.data?.message || "Failed to assign lead",
          });
        }
      },
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useAddLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useUpdateLeadStatusMutation,
  useAssignLeadMutation,
} = leadsApiSlice;


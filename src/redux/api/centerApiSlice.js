import { apiSlice } from "./apiSlice";

export const centerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCenters: builder.query({
      query: (params = {}) => ({
        url: "/centers/",
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        const centers = result?.data?.centers || [];
        return [
          { type: "Center", id: "LIST" },
          ...centers.map((c) => ({ type: "Center", id: c._id })),
        ];
      },
    }),


    getCenterById: builder.query({
      query: (id) => ({
        url: `/centers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Center", id }],
    }),


    addCenter: builder.mutation({
      query: (data) => ({
        url: "/centers/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Center", id: "LIST" }],
    }),


    updateCenter: builder.mutation({
      query: ({ id, data }) => ({
        url: `/centers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Center", id },
        { type: "Center", id: "LIST" },
      ],
    }),


    deleteCenter: builder.mutation({
      query: (id) => ({
        url: `/centers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Center", id: "LIST" }],
    }),


    addSecurityDeposit: builder.mutation({
      query: ({ centerId, data }) => ({
        url: `/centers/${centerId}/security-deposit`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { centerId }) => [
        { type: "Center", id: centerId },
      ],
    }),

    deleteSecurityDeposit: builder.mutation({
      query: ({ centerId, depositId }) => ({
        url: `/centers/${centerId}/security-deposit/${depositId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { centerId }) => [
        { type: "Center", id: centerId },
      ],
    }),

    updateSecurityDeposit: builder.mutation({
      query: ({ centerId, depositId, data }) => ({
        url: `/centers/${centerId}/security-deposit/${depositId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { centerId }) => [
        { type: "Center", id: centerId },
      ],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetCentersQuery,
  useGetCenterByIdQuery,
  useAddCenterMutation,
  useUpdateCenterMutation,
  useDeleteCenterMutation,
  useAddSecurityDepositMutation,
  useDeleteSecurityDepositMutation,
  useUpdateSecurityDepositMutation,
} = centerApiSlice;

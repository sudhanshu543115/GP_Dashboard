import { apiSlice } from "./apiSlice";

export const depositApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /* ===============================
       GET ALL DEPOSITS
    =============================== */
    getAllDeposits: builder.query({
      query: () => ({
        url: "/security-deposits/",
        method: "GET",
      }),
      providesTags: (result) => {
        const deposits = result?.data || [];
        return [
          { type: "Deposit", id: "LIST" },
          ...deposits.map((d) => ({
            type: "Deposit",
            id: d._id,
          })),
        ];
      },
    }),

    /* ===============================
       GET DEPOSITS BY CENTER
    =============================== */
    getDepositsByCenter: builder.query({
      query: (centerId) => ({
        url: `/security-deposits/${centerId}`,
        method: "GET",
      }),
      providesTags: (result, error, centerId) => [
        { type: "Deposit", id: `CENTER_${centerId}` },
      ],
    }),

    /* ===============================
       ADD DEPOSIT
    =============================== */
    addDeposit: builder.mutation({
      query: ({ centerId, data }) => ({
        url: `/security-deposits/${centerId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { centerId }) => [
        { type: "Deposit", id: "LIST" },
        { type: "Deposit", id: `CENTER_${centerId}` },
      ],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetAllDepositsQuery,
  useGetDepositsByCenterQuery,
  useAddDepositMutation,
} = depositApiSlice;
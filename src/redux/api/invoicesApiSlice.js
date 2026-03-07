import { apiSlice } from "./apiSlice";

export const invoiceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET ALL INVOICES
    ========================= */
    getInvoices: builder.query({
      query: (params = {}) => ({
        url: "/invoices/",
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        const invoices = result?.data || [];

        return [
          { type: "Invoice", id: "LIST" },
          ...invoices.map((inv) => ({
            type: "Invoice",
            id: inv._id,
          })),
        ];
      },
    }),

    /* =========================
       GET SINGLE INVOICE
    ========================= */
    getInvoiceById: builder.query({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "Invoice", id },
      ],
    }),

    /* =========================
       CREATE INVOICE
    ========================= */
    createInvoice: builder.mutation({
      query: (data) => ({
        url: "/invoices/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Invoice", id: "LIST" }],
    }),

    /* =========================
       UPDATE INVOICE
    ========================= */
    updateInvoice: builder.mutation({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Invoice", id },
        { type: "Invoice", id: "LIST" },
      ],
    }),

    /* =========================
       DELETE INVOICE
    ========================= */
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Invoice", id: "LIST" }],
    }),

    /* =========================
       GENERATE INVOICE NUMBER
    ========================= */
    generateInvoiceNumber: builder.query({
      query: () => ({
        url: "/invoices/generate-number",
        method: "GET",
      }),
    }),

    /* =========================
       CALCULATE AMOUNTS
    ========================= */
    calculateInvoice: builder.mutation({
      query: (data) => ({
        url: "/invoices/calculate",
        method: "POST",
        body: data,
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGenerateInvoiceNumberQuery,
  useLazyGenerateInvoiceNumberQuery,
  useCalculateInvoiceMutation,
} = invoiceApiSlice;
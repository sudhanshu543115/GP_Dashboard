import { apiSlice } from './apiSlice';
import { toast } from '../../utils/toast';

const CLIENTS_URL = 'clients/';
const FORMS_URL = 'forms';
const REQUEST_CALL_URL = 'request-call';

export const clientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    
    getClients: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: CLIENTS_URL,
        params: { page, limit },
      }),

      
      transformResponse: (response) => {
        if (response?.message?.clients) return response.message;
        if (response?.data?.clients) return response.data;
        if (Array.isArray(response?.clients)) return response;
        return { clients: [], pagination: null };
      },

      providesTags: (result) =>
        result?.clients
          ? [
              { type: 'Client', id: 'LIST' },
              ...result.clients.map((client) => ({
                type: 'Client',
                id: client._id,
              })),
            ]
          : [{ type: 'Client', id: 'LIST' }],

      keepUnusedDataFor: 5,
    }),

    getClient: builder.query({
      query: (clientId) => `${CLIENTS_URL}/${clientId}`,
      transformResponse: (response) => {
        if (response?.message?.clients) return response.message;
        if (response?.data?.clients) return response.data;
        if (Array.isArray(response?.clients)) return response;
        if (Array.isArray(response?.data)) return { clients: response.data, pagination: null };
        return { clients: [], pagination: null };
      },
      providesTags: (result, error, arg) => [
        { type: 'Client', id: arg },
      ],
    }),

    getForms: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '' } = {}) => ({
        url: FORMS_URL,
        params: { page, limit, search, status },
      }),
      transformResponse: (response) => response,
      providesTags: (result) =>
        Array.isArray(result?.data)
          ? [
              { type: 'Form', id: 'LIST' },
              ...result.data.map((form) => ({
                type: 'Form',
                id: form._id,
              })),
            ]
          : [{ type: 'Form', id: 'LIST' }],
      keepUnusedDataFor: 5,
    }),

    getFormByFormId: builder.query({
      query: (formId) => `${FORMS_URL}/${formId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, arg) => [
        { type: 'Form', id: result?._id || arg },
      ],
    }),

    submitForm: builder.mutation({
      query: (data) => ({
        url: `${FORMS_URL}/submit`,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading('Submitting form...');
        try {
          await queryFulfilled;
          toast.update(tid, { type: 'success', message: 'Form submitted successfully' });
        } catch (err) {
          toast.update(tid, { type: 'error', message: err?.error?.data?.message || 'Failed to submit form' });
        }
      },
      invalidatesTags: [{ type: 'Form', id: 'LIST' }],
    }),

    updateFormStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${FORMS_URL}/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading('Updating form status...');
        try {
          await queryFulfilled;
          toast.update(tid, { type: 'success', message: 'Form status updated' });
        } catch (err) {
          toast.update(tid, { type: 'error', message: err?.error?.data?.message || 'Failed to update form status' });
        }
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'Form', id: 'LIST' },
        { type: 'Form', id: arg.id },
      ],
    }),

    assignForm: builder.mutation({
      query: ({ id, userId }) => ({
        url: `${FORMS_URL}/${id}/assign`,
        method: 'PATCH',
        body: { userId },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading('Assigning form...');
        try {
          await queryFulfilled;
          toast.update(tid, { type: 'success', message: 'Form assigned successfully' });
        } catch (err) {
          toast.update(tid, { type: 'error', message: err?.error?.data?.message || 'Failed to assign form' });
        }
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'Form', id: 'LIST' },
        { type: 'Form', id: arg.id },
      ],
    }),

    deleteForm: builder.mutation({
      query: (id) => ({
        url: `${FORMS_URL}/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading('Deleting form...');
        try {
          await queryFulfilled;
          toast.update(tid, { type: 'success', message: 'Form deleted successfully' });
        } catch (err) {
          toast.update(tid, { type: 'error', message: err?.error?.data?.message || 'Failed to delete form' });
        }
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'Form', id: 'LIST' },
        { type: 'Form', id: arg },
      ],
    }),

    getRequestCalls: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: REQUEST_CALL_URL,
        params: { page, limit },
      }),
      transformResponse: (response) => response,
      keepUnusedDataFor: 5,
    }),

    addRequestCall: builder.mutation({
      query: (data) => ({
        url: REQUEST_CALL_URL,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading('Creating callback request...');
        try {
          await queryFulfilled;
          toast.update(tid, { type: 'success', message: 'Callback request created' });
        } catch (err) {
          toast.update(tid, { type: 'error', message: err?.error?.data?.message || 'Failed to create callback request' });
        }
      },
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),

    updateRequestCall: builder.mutation({
      query: ({ id, data }) => ({
        url: `${REQUEST_CALL_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading('Updating callback request...');
        try {
          await queryFulfilled;
          toast.update(tid, { type: 'success', message: 'Callback request updated' });
        } catch (err) {
          toast.update(tid, { type: 'error', message: err?.error?.data?.message || 'Failed to update callback request' });
        }
      },
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),

    deleteRequestCall: builder.mutation({
      query: (id) => ({
        url: `${REQUEST_CALL_URL}/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading('Deleting callback request...');
        try {
          await queryFulfilled;
          toast.update(tid, { type: 'success', message: 'Callback request deleted' });
        } catch (err) {
          toast.update(tid, { type: 'error', message: err?.error?.data?.message || 'Failed to delete callback request' });
        }
      },
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),


    addClient: builder.mutation({
      query: (data) => ({
        url: CLIENTS_URL,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading('Creating client...');
        try {
          await queryFulfilled;
          toast.update(tid, { type: 'success', message: 'Client created successfully' });
        } catch (err) {
          toast.update(tid, { type: 'error', message: err?.error?.data?.message || 'Failed to create client' });
        }
      },
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),

    
    updateClient: builder.mutation({
      query: (data) => ({
        url: `${CLIENTS_URL}/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading('Updating client...');
        try {
          await queryFulfilled;
          toast.update(tid, { type: 'success', message: 'Client updated successfully' });
        } catch (err) {
          toast.update(tid, { type: 'error', message: err?.error?.data?.message || 'Failed to update client' });
        }
      },
      invalidatesTags: (r, e, arg) => [
        { type: 'Client', id: arg._id },
      ],
    }),

    
    deleteClient: builder.mutation({
      query: (clientId) => ({
        url: `${CLIENTS_URL}/${clientId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading('Deleting client...');
        try {
          await queryFulfilled;
          toast.update(tid, { type: 'success', message: 'Client deleted successfully' });
        } catch (err) {
          toast.update(tid, { type: 'error', message: err?.error?.data?.message || 'Failed to delete client' });
        }
      },
      invalidatesTags: (r, e, arg) => [
        { type: 'Client', id: arg },
      ],
    }),

  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useGetFormsQuery,
  useGetFormByFormIdQuery,
  useLazyGetFormByFormIdQuery,
  useSubmitFormMutation,
  useUpdateFormStatusMutation,
  useAssignFormMutation,
  useDeleteFormMutation,
  useGetRequestCallsQuery,
  useAddRequestCallMutation,
  useUpdateRequestCallMutation,
  useDeleteRequestCallMutation,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApiSlice;

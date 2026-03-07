import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const BASE_URL = 'https://global-project-ek8i.onrender.com/api/v1/';
// const BASE_URL = 'http://localhost:5000/api/v1/';


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token; // ✅ correct place

      console.log('Token being sent:', token);

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['User', 'Project', 'Blog', 'Query', 'Client','Invoice', 'Center'],
  endpoints: () => ({}),
});
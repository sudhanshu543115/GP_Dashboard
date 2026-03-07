import { apiSlice } from './apiSlice';

const BLOGS_URL = 'blogs'; // adjust to match backend route

export const blogsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // fetch all blogs/posts
    getBlogs: builder.query({
      query: () => ({
        url: BLOGS_URL,
      }),
      transformResponse: (response) => response,
      providesTags: (result) =>
        result?.data
          ? [
              { type: 'Blog', id: 'LIST' },
              ...result.data.map((blog) => ({
                type: 'Blog',
                id: blog._id || blog.id,
              })),
            ]
          : [{ type: 'Blog', id: 'LIST' }],
      keepUnusedDataFor: 5,
    }),

    // fetch single blog by id
    getBlog: builder.query({
      query: (blogId) => ({
        url: `${BLOGS_URL}/${blogId}`,
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, arg) => [
        { type: 'Blog', id: arg },
      ],
    }),

    // create new blog
    addBlog: builder.mutation({
      query: (data) => ({
        url: BLOGS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),

    // update existing blog
    updateBlog: builder.mutation({
      query: ({ _id, data }) => ({
        url: `${BLOGS_URL}/${_id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Blog', id: arg._id },
      ],
    }),

    // delete a blog
    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `${BLOGS_URL}/${blogId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Blog', id: arg },
      ],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogsApiSlice;
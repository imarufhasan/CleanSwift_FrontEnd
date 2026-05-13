import { api } from './api';

type Page = {
  _id?: string;
  slug: string;
  title?: string;
  content?: string;
  published?: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const pageApi = api.injectEndpoints({
  endpoints: builder => ({
    getPageBySlug: builder.query<ApiResponse<Page | null>, string>({
      query: slug => ({
        url: `/pages/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, slug) => [{ type: 'Page', id: slug }],
    }),
  }),
});

export const { useGetPageBySlugQuery } = pageApi;

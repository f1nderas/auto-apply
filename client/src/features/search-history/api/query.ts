import { baseApi } from '@shared/api/baseApi';

const searchHistoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSearchHistory: build.query<string[], void>({
      query: () => '/search-history',
      providesTags: ['SearchHistory'],
    }),
    addSearchQuery: build.mutation<void, string>({
      query: (query) => ({ url: '/search-history', method: 'POST', body: { query } }),
      invalidatesTags: ['SearchHistory'],
    }),
  }),
});

const { useGetSearchHistoryQuery, useAddSearchQueryMutation } = searchHistoryApi;

export { useGetSearchHistoryQuery, useAddSearchQueryMutation };

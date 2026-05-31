import { baseApi } from '@shared/api/baseApi';

const suggestionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSuggestions: build.query<string[], { query: string } | undefined>({
      query: (params) => ({ url: '/suggestions', params }),
    }),
  }),
});

const { useLazyGetSuggestionsQuery } = suggestionsApi;

export { useLazyGetSuggestionsQuery };

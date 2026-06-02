import { baseApi } from '@shared/api/baseApi';

interface AreaOption {
  value: number;
  label: string;
}

const suggestionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSuggestions: build.query<string[], { query: string } | undefined>({
      query: (params) => ({ url: '/suggestions', params }),
    }),
    getAreas: build.query<AreaOption[], void>({
      query: () => '/suggestions/areas',
    }),
  }),
});

const { useLazyGetSuggestionsQuery, useGetAreasQuery } = suggestionsApi;

export { useLazyGetSuggestionsQuery, useGetAreasQuery };
export type { AreaOption };

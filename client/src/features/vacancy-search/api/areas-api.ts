import { baseApi } from '@shared/api/baseApi';

interface AreaOption {
  value: number;
  label: string;
}

const areasApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAreas: build.query<AreaOption[], void>({
      query: () => '/suggestions/areas',
    }),
  }),
});

const { useGetAreasQuery } = areasApi;

export { useGetAreasQuery };

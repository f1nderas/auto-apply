import { baseApi } from '@shared/api/baseApi';

interface AddHistoryItemDto {
  vacancyId: string;
  vacancyName: string;
  employer: string;
  status: 'success' | 'failed';
}

interface HistoryRecord extends AddHistoryItemDto {
  appliedAt: string;
}

const historyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addHistory: build.mutation<void, AddHistoryItemDto>({
      query: (body) => ({ url: '/history', method: 'POST', body }),
      invalidatesTags: ['History'],
    }),
    getHistory: build.query<HistoryRecord[], void>({
      query: () => '/history',
      providesTags: ['History'],
    }),
  }),
});

const { useAddHistoryMutation, useGetHistoryQuery } = historyApi;

export type { HistoryRecord };
export { useAddHistoryMutation, useGetHistoryQuery };

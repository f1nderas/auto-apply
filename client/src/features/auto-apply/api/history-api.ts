import { baseApi } from '@shared/api/baseApi';

interface AddHistoryItemDto {
  vacancyId: string;
  vacancyName: string;
  employer: string;
  status: 'success' | 'failed';
  resumeHash?: string;
}

interface HistoryRecord extends AddHistoryItemDto {
  appliedAt: string;
}

interface HistoryStats {
  total: number;
  success: number;
  failed: number;
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
    getHistoryStats: build.query<HistoryStats, void>({
      query: () => '/history/stats',
      providesTags: ['History'],
    }),
    clearHistory: build.mutation<void, void>({
      query: () => ({ url: '/history', method: 'DELETE' }),
      invalidatesTags: ['History'],
    }),
  }),
});

const {
  useAddHistoryMutation,
  useGetHistoryQuery,
  useGetHistoryStatsQuery,
  useClearHistoryMutation,
} = historyApi;

export type { HistoryRecord, HistoryStats };
export { useAddHistoryMutation, useGetHistoryQuery, useGetHistoryStatsQuery, useClearHistoryMutation };

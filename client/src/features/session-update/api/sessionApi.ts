import { baseApi } from '@shared/api/baseApi';

const sessionUpdateApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateSession: build.mutation<{ ok: boolean }, { curl: string; resumeHash?: string }>({
      query: (body) => ({ url: '/admin/session', method: 'POST', body }),
      invalidatesTags: ['ActiveSession'],
    }),
  }),
});

const { useUpdateSessionMutation } = sessionUpdateApi;

export { useUpdateSessionMutation };

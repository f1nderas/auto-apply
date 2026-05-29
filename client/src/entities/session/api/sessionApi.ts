import { baseApi } from '@shared/api/baseApi';

interface ActiveSessionDto {
  hash: string | null;
  registeredHashes: string[];
}

const sessionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getActiveSession: build.query<ActiveSessionDto, void>({
      query: () => '/admin/session/active',
      providesTags: ['ActiveSession'],
    }),
    switchSession: build.mutation<{ ok: boolean }, { hash: string }>({
      query: (body) => ({ url: '/admin/session/switch', method: 'POST', body }),
      invalidatesTags: ['ActiveSession'],
    }),
  }),
});

const { useGetActiveSessionQuery, useSwitchSessionMutation } = sessionApi;

export { useGetActiveSessionQuery, useSwitchSessionMutation };

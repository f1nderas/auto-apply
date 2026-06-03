import { baseApi } from '@shared/api/baseApi';

interface StartAutoApplyPayload {
  text: string;
  area: number;
  count: number;
  resumeHashes: string[];
}

const autoApplyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    startAutoApply: build.mutation<void, StartAutoApplyPayload>({
      query: (body) => ({ url: '/auto-apply/start', method: 'POST', body }),
    }),
    stopAutoApply: build.mutation<void, void>({
      query: () => ({ url: '/auto-apply/stop', method: 'POST' }),
    }),
  }),
});

const { useStartAutoApplyMutation, useStopAutoApplyMutation } = autoApplyApi;

export { useStartAutoApplyMutation, useStopAutoApplyMutation };
export type { StartAutoApplyPayload };

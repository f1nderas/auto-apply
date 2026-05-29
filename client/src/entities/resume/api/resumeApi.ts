import { baseApi } from '@shared/api/baseApi';
import type { ResumeDto } from '@dto';

const resumeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getResume: build.query<ResumeDto, string>({
      query: (hash) => `/resume/${hash}`,
    }),
    updateAbout: build.mutation<void, { hash: string; text: string }>({
      query: ({ hash, text }) => ({
        url: `/resume/${hash}/about`,
        method: 'PATCH',
        body: { text },
      }),
    }),
  }),
});

const { useGetResumeQuery, useUpdateAboutMutation } = resumeApi;

export { useGetResumeQuery, useUpdateAboutMutation };

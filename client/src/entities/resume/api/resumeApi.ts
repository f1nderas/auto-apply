import { baseApi } from '@shared/api/baseApi';
import type { ResumeDto, UpdateAboutDto } from '@dto';

const resumeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getResume: build.query<ResumeDto, void>({
      query: () => '/resume',
    }),
    updateAbout: build.mutation<void, UpdateAboutDto>({
      query: (body) => ({ url: '/resume/about', method: 'PATCH', body }),
    }),
  }),
});

const { useGetResumeQuery, useUpdateAboutMutation } = resumeApi;

export { useGetResumeQuery, useUpdateAboutMutation };

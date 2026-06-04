import { baseApi } from '@shared/api/baseApi';
import type { ResumeDto } from '@dto';

interface ResumeProfile {
  hash: string;
  name: string;
  experience: number;
}

interface SessionFields {
  cookie: string;
  xsrfToken: string;
  staticVersion?: string;
  baseUrl?: string;
}

interface AddProfileDto extends SessionFields {
  hash: string;
  name: string;
  experience: number;
}

interface UpdateProfileDto {
  name: string;
  experience: number;
  cookie?: string;
  xsrfToken?: string;
  staticVersion?: string;
  baseUrl?: string;
}

const resumeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfiles: build.query<ResumeProfile[], void>({
      query: () => '/resume',
      providesTags: ['Profiles'],
    }),
    addProfile: build.mutation<void, AddProfileDto>({
      query: (body) => ({ url: '/resume', method: 'POST', body }),
      invalidatesTags: ['Profiles'],
    }),
    updateProfile: build.mutation<void, { hash: string } & UpdateProfileDto>({
      query: ({ hash, ...body }) => ({ url: `/resume/${hash}/profile`, method: 'PATCH', body }),
      invalidatesTags: ['Profiles'],
    }),
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

const {
  useGetProfilesQuery,
  useAddProfileMutation,
  useUpdateProfileMutation,
  useGetResumeQuery,
  useUpdateAboutMutation,
} = resumeApi;

export type { ResumeProfile, UpdateProfileDto };
export {
  useGetProfilesQuery,
  useAddProfileMutation,
  useUpdateProfileMutation,
  useGetResumeQuery,
  useUpdateAboutMutation,
};

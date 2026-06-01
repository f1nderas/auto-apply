import { baseApi } from '@shared/api/baseApi';
import type {
  VacanciesControllerSearchApiArg,
  VacanciesControllerApplyApiArg,
  VacanciesControllerSearchApiResponse,
  VacanciesControllerApplyApiResponse,
} from '@dto';

interface SearchParams extends VacanciesControllerSearchApiArg {
  resumeHash?: string;
}

interface ApplyParams extends VacanciesControllerApplyApiArg {
  applyVacancyDto: VacanciesControllerApplyApiArg['applyVacancyDto'] & {
    resumeHash?: string;
  };
}

const vacancyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchVacancies: build.query<VacanciesControllerSearchApiResponse, SearchParams>({
      query: ({ resumeHash, ...rest }) => ({
        url: '/vacancies',
        params: { ...rest, ...(resumeHash ? { resumeHash } : {}) },
      }),
    }),
    applyVacancy: build.mutation<VacanciesControllerApplyApiResponse, ApplyParams>({
      query: ({ applyVacancyDto }) => ({
        url: '/vacancies/apply',
        method: 'POST',
        body: applyVacancyDto,
      }),
    }),
  }),
});

const {
  useLazySearchVacanciesQuery,
  useApplyVacancyMutation,
} = vacancyApi;

export { useLazySearchVacanciesQuery, useApplyVacancyMutation };

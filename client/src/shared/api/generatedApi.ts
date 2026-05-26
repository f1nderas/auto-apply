import { baseApi as api } from './baseApi';
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    appControllerGetHello: build.query<
      AppControllerGetHelloApiResponse,
      AppControllerGetHelloApiArg
    >({
      query: () => ({ url: `/` }),
    }),
    vacanciesControllerSearch: build.query<
      VacanciesControllerSearchApiResponse,
      VacanciesControllerSearchApiArg
    >({
      query: (queryArg) => ({
        url: `/vacancies`,
        params: {
          text: queryArg.text,
          area: queryArg.area,
          page: queryArg.page,
          perPage: queryArg.perPage,
        },
      }),
    }),
    vacanciesControllerApply: build.mutation<
      VacanciesControllerApplyApiResponse,
      VacanciesControllerApplyApiArg
    >({
      query: (queryArg) => ({
        url: `/vacancies/apply`,
        method: 'POST',
        body: queryArg.applyVacancyDto,
      }),
    }),
    adminControllerUpdateSession: build.mutation<
      AdminControllerUpdateSessionApiResponse,
      AdminControllerUpdateSessionApiArg
    >({
      query: (queryArg) => ({
        url: `/admin/session`,
        method: 'POST',
        body: queryArg.updateSessionDto,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedApi };
export type AppControllerGetHelloApiResponse = unknown;
export type AppControllerGetHelloApiArg = void;
export type VacanciesControllerSearchApiResponse =
  /** status 200  */ VacanciesResponseDto;
export type VacanciesControllerSearchApiArg = {
  text: string;
  area?: number;
  page?: number;
  perPage?: number;
};
export type VacanciesControllerApplyApiResponse =
  /** status 201  */ ApplyResponseDto;
export type VacanciesControllerApplyApiArg = {
  applyVacancyDto: ApplyVacancyDto;
};
export type AdminControllerUpdateSessionApiResponse = /** status 200  */ {
  ok?: boolean;
};
export type AdminControllerUpdateSessionApiArg = {
  updateSessionDto: UpdateSessionDto;
};
export type SalaryDto = {
  from?: number | null;
  to?: number | null;
  currency: string;
  gross: boolean;
};
export type EmployerDto = {
  id: string;
  name: string;
  url: string;
  accreditedIt: boolean;
};
export type VacancyDto = {
  id: string;
  name: string;
  url: string;
  area: string;
  salary?: SalaryDto | null;
  employer: EmployerDto;
  experience: string;
  employment: string;
  schedule: string;
  responseLetterRequired: boolean;
  requirement?: string | null;
  responsibility?: string | null;
  publishedAt: string;
};
export type VacanciesResponseDto = {
  vacancies: VacancyDto[];
  total: number;
  page: number;
  perPage: number;
  pages?: number | null;
};
export type ApplyResponseDto = {
  ok: boolean;
  topicId?: string | null;
  chatId?: string | null;
};
export type ApplyVacancyDto = {
  vacancyId: string;
  letter?: string;
};
export type UpdateSessionDto = {
  curl: string;
};
export const {
  useAppControllerGetHelloQuery,
  useLazyAppControllerGetHelloQuery,
  useVacanciesControllerSearchQuery,
  useLazyVacanciesControllerSearchQuery,
  useVacanciesControllerApplyMutation,
  useAdminControllerUpdateSessionMutation,
} = injectedRtkApi;

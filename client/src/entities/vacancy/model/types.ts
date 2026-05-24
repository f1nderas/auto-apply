interface Salary {
  from: number | null;
  to: number | null;
  currency: string;
  gross: boolean;
}

interface Employer {
  id: string;
  name: string;
  url: string;
  accreditedIt: boolean;
}

interface Vacancy {
  id: string;
  name: string;
  url: string;
  area: string;
  salary: Salary | null;
  employer: Employer;
  schedule: string;
  responseLetterRequired: boolean;
  publishedAt: string;
  experience: string;
  employment: string;
  requirement: string | null;
  responsibility: string | null;
}

interface VacanciesResponse {
  vacancies: Vacancy[];
  total: number;
  page: number;
  perPage: number;
  pages: number | null;
}

export type { Salary, Employer, Vacancy, VacanciesResponse };

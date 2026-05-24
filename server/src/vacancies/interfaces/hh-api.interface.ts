/**
 * Типы внутреннего Web API HH.ru (hh.ru/search/vacancy).
 * Это не публичный API — структура отличается от api.hh.ru.
 */

export interface HhCompensation {
  from: number | null;
  to: number | null;
  currencyCode: string; // "RUR" | "USD" | "EUR" | "KZT"
  gross: boolean;
  mode: string; // "MONTH" | "YEAR" | "WEEK"
}

export interface HhCompany {
  id: number;
  name: string;
  visibleName: string;
  accreditedITEmployer: boolean;
  companySiteUrl: string;
  '@trusted': boolean;
  '@category': string;
}

export interface HhArea {
  '@id': number;
  name: string;
  path: string;
}

export interface HhLinks {
  desktop: string;
  mobile: string;
}

export interface HhTimestamp {
  '@timestamp': number;
  $: string; // ISO 8601
}

export interface HhVacancy {
  vacancyId: number;
  name: string;
  company: HhCompany;
  compensation: HhCompensation | null;
  area: HhArea;
  links: HhLinks;
  publicationTime: HhTimestamp;
  acceptTemporary: boolean;
  '@workSchedule': string;
  '@responseLetterRequired': boolean;
  '@showContact': boolean;
}

export interface HhCriteria {
  text: string;
  area: number[];
  page: number;
  items_on_page: number;
  order_by: string;
}

export interface HhWebSearchResponse {
  vacancySearchResult: {
    vacancies: HhVacancy[];
    criteria: HhCriteria;
    totalItems?: number;
    pages?: number;
    totalUsedFilters: number;
  };
}

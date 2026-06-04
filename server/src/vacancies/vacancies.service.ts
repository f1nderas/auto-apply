import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

const extractHhMessage = (data: unknown, fallback: string): string => {
  if (typeof data === 'string') return data || fallback;
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (typeof d.description === 'string') return d.description;
    if (typeof d.message === 'string') return d.message;
    if (
      Array.isArray(d.errors) &&
      typeof (d.errors[0] as Record<string, unknown>)?.value === 'string'
    )
      return (d.errors[0] as Record<string, unknown>).value as string;
  }
  return fallback;
};
import axios from 'axios';
import { SearchVacanciesDto } from './dto/search-vacancies.dto';
import {
  VacanciesResponseDto,
  VacancyDto,
  SalaryDto,
  EmployerDto,
} from './dto/vacancy-response.dto';
import {
  HhWebSearchResponse,
  HhVacancy,
  HhCompensation,
  HhCompany,
  HhPaging,
  HhApplyResponse,
} from './interfaces/hh-api.interface';
import { ResumeStore } from './resume-store.service';
import { HH_BASE_URL, ESSENTIAL_COOKIES } from './constants';
import { ApplyVacancyDto, ApplyResponseDto } from './dto/apply-vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(private readonly resumeStore: ResumeStore) {}

  async search(params: SearchVacanciesDto): Promise<VacanciesResponseDto> {
    const { text, area, page, perPage, resumeHash, searchFields, workFormat } =
      params;
    const {
      cookie: rawCookie,
      xsrfToken,
      staticVersion,
      baseUrl,
    } = this.resumeStore.getSession(resumeHash);
    const cookie = this.filterCookies(rawCookie);

    // GIB (Group-IB) антибот: значения берутся из соответствующих кук
    const fgsscgib = this.extractCookie(rawCookie, 'fgsscgib-w-hh');
    const gsscgib = this.extractCookie(rawCookie, 'gsscgib-w-hh');

    // URLSearchParams нужен для search_field=name&search_field=description (повторяющиеся ключи)
    const qs = new URLSearchParams();
    qs.append('text', text);
    qs.append('page', String(page + 1));
    qs.append('items_on_page', String(perPage));
    qs.append('from', 'suggest_post');
    qs.append('ored_clusters', 'true');
    qs.append('enable_snippets', 'false');
    if (area) qs.append('area', String(area));
    if (workFormat) qs.append('work_format', workFormat);
    const fields = searchFields?.length
      ? searchFields
      : ['name', 'description'];
    fields.forEach((f) => qs.append('search_field', f));

    try {
      const { data } = await axios.get<HhWebSearchResponse>(
        `${baseUrl}/search/vacancy?${qs.toString()}`,
        {
          headers: {
            accept: 'application/json',
            referer: `${baseUrl}/search/vacancy?${qs.toString()}`,
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
            'x-gib-fgsscgib-w-hh': fgsscgib,
            'x-gib-gsscgib-w-hh': gsscgib,
            'x-hhtmfrom': 'vacancy_search_list',
            'x-is-spa': 'true',
            'x-requested-with': 'XMLHttpRequest',
            'x-static-version': staticVersion,
            cookie,
            'x-xsrftoken': xsrfToken,
          },
        },
      );

      const {
        vacancies,
        criteria,
        totalResults,
        paging,
        userLabelsForVacancies,
      } = data.vacancySearchResult;

      return {
        vacancies: vacancies.map((v) =>
          this.mapVacancy(v, userLabelsForVacancies),
        ),
        total: totalResults ?? vacancies.length,
        page,
        perPage: criteria.items_on_page,
        pages: this.calcPages(paging, page),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          extractHhMessage(error.response?.data, 'Ошибка запроса к HH.ru'),
          error.response?.status ?? HttpStatus.BAD_GATEWAY,
        );
      }
      throw error;
    }
  }

  async apply(dto: ApplyVacancyDto): Promise<ApplyResponseDto> {
    const { vacancyId, letter, resumeHash: dtoResumeHash } = dto;
    const {
      cookie: rawCookie,
      xsrfToken,
      baseUrl,
    } = this.resumeStore.getSession(dtoResumeHash);
    const resumeHash = dtoResumeHash ?? '';
    const cookie = this.filterCookies(rawCookie);
    const fgsscgib = this.extractCookie(rawCookie, 'fgsscgib-w-hh');
    const gsscgib = this.extractCookie(rawCookie, 'gsscgib-w-hh');

    const baseHeaders = {
      accept: 'application/json',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
      'x-gib-fgsscgib-w-hh': fgsscgib,
      'x-gib-gsscgib-w-hh': gsscgib,
      'x-requested-with': 'XMLHttpRequest',
      cookie,
      'x-xsrftoken': xsrfToken,
    };

    const referer = `${baseUrl}/vacancy/${vacancyId}`;

    try {
      const form = new FormData();
      form.append('_xsrf', xsrfToken);
      form.append('vacancy_id', vacancyId);
      form.append('resume_hash', resumeHash);
      form.append('ignore_postponed', 'true');
      form.append('incomplete', 'false');
      form.append('mark_applicant_visible_in_vacancy_country', 'false');
      form.append('country_ids', '[]');
      form.append('lux', 'true');
      form.append('withoutTest', 'no');
      form.append('hhtmFromLabel', '');
      form.append('hhtmSourceLabel', '');
      if (letter) form.append('letter', letter);

      const { data: applyData } = await axios.post<HhApplyResponse>(
        `${baseUrl}/applicant/vacancy_response/popup`,
        form,
        {
          headers: {
            ...baseHeaders,
            'x-hhtmsource': 'vacancy',
            'x-hhtmfrom': '',
            origin: baseUrl,
            referer,
          },
        },
      );
      return {
        ok: applyData.success === 'true',
        topicId: applyData.topic_id ?? null,
        chatId: applyData.chat_id ?? null,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          extractHhMessage(error.response?.data, 'Ошибка отклика на вакансию'),
          error.response?.status ?? HttpStatus.BAD_GATEWAY,
        );
      }
      throw error;
    }
  }

  /** Добавляет письмо к уже отправленному отклику через edit_ajax.
   *  Возвращает false если работодатель уже просмотрел (notEditable). */
  async addLetterToResponse(
    topicId: string,
    text: string,
    resumeHash: string | undefined,
  ): Promise<boolean> {
    const {
      cookie: rawCookie,
      xsrfToken,
      baseUrl,
    } = this.resumeStore.getSession(resumeHash);
    const cookie = this.filterCookies(rawCookie);
    const fgsscgib = this.extractCookie(rawCookie, 'fgsscgib-w-hh');
    const gsscgib = this.extractCookie(rawCookie, 'gsscgib-w-hh');

    const form = new FormData();
    form.append('_xsrf', xsrfToken);
    form.append('text', text);
    form.append('topicId', topicId);

    try {
      const { data } = await axios.post<{ success?: string; error?: string }>(
        `${baseUrl}/applicant/vacancy_response/edit_ajax`,
        form,
        {
          headers: {
            accept: 'application/json',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
            'x-gib-fgsscgib-w-hh': fgsscgib,
            'x-gib-gsscgib-w-hh': gsscgib,
            'x-requested-with': 'XMLHttpRequest',
            cookie,
            'x-xsrftoken': xsrfToken,
          },
        },
      );
      return data.success === 'true';
    } catch {
      return false;
    }
  }

  // lastPage.page — 0-индексный номер последней страницы.
  // Если lastPage === null — мы уже на последней, итого page + 1.
  private calcPages(paging: HhPaging | undefined, page: number): number | null {
    if (!paging) return null;
    return (paging.lastPage?.page ?? page) + 1;
  }

  private extractCookie(cookieStr: string, name: string): string {
    const match = cookieStr.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match?.[1] ?? '';
  }

  private filterCookies(cookieStr: string): string {
    return cookieStr
      .split(/;\s*/)
      .filter((pair) => ESSENTIAL_COOKIES.has(pair.split('=')[0]))
      .join('; ');
  }

  private mapVacancy(
    v: HhVacancy,
    labels?: Record<string, string[]>,
  ): VacancyDto {
    const labelArr = labels?.[String(v.vacancyId)];
    const applicationStatus =
      labelArr && labelArr.length > 0 ? labelArr[0] : null;

    return {
      id: String(v.vacancyId),
      name: v.name,
      url: v.links.desktop,
      area: v.area.name,
      salary: this.mapSalary(v.compensation),
      employer: this.mapEmployer(v.company),
      schedule: v['@workSchedule'] ?? '—',
      responseLetterRequired: v['@responseLetterRequired'],
      publishedAt: v.publicationTime.$,
      experience: '—',
      employment: '—',
      requirement: null,
      responsibility: null,
      applicationStatus,
    };
  }

  private mapSalary(comp: HhCompensation | null): SalaryDto | null {
    if (!comp || !comp.currencyCode) return null;
    return {
      from: comp.from ?? null,
      to: comp.to ?? null,
      currency: comp.currencyCode,
      gross: comp.gross,
    };
  }

  private mapEmployer(company: HhCompany): EmployerDto {
    return {
      id: String(company.id),
      name: company.visibleName || company.name,
      url: `${HH_BASE_URL}/employer/${company.id}`,
      accreditedIt: company.accreditedITEmployer,
    };
  }
}

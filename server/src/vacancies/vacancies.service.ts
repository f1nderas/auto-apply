import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
} from './interfaces/hh-api.interface';

const HH_WEB_BASE = 'https://hh.ru';

@Injectable()
export class VacanciesService {
  constructor(private readonly config: ConfigService) {}

  async search(params: SearchVacanciesDto): Promise<VacanciesResponseDto> {
    const { text, area, page, perPage } = params;
    const cookie = this.config.get<string>('HH_COOKIE')!;
    const xsrfToken = this.config.get<string>('HH_XSRF_TOKEN')!;

    // GIB (Group-IB) антибот: значения берутся из соответствующих кук
    const fgsscgib = this.extractCookie(cookie, 'fgsscgib-w-hh');
    const gsscgib = this.extractCookie(cookie, 'gsscgib-w-hh');

    try {
      const { data } = await axios.get<HhWebSearchResponse>(
        `${HH_WEB_BASE}/search/vacancy`,
        {
          params: {
            text,
            area,
            page: page + 1,
            items_on_page: perPage,
            from: 'suggest_post',
            ored_clusters: true,
          },
          headers: {
            accept: 'application/json',
            'accept-language': 'ru-RU,ru;q=0.9',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            referer: 'https://hh.ru/search/vacancy',
            'sec-ch-ua':
              '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
            'x-gib-fgsscgib-w-hh': fgsscgib,
            'x-gib-gsscgib-w-hh': gsscgib,
            'x-hhtmfrom': 'vacancy_search_list',
            'x-is-spa': 'true',
            'x-requested-with': 'XMLHttpRequest',
            'x-static-version': '26.21.5.5',
            cookie,
            'x-xsrftoken': xsrfToken,
          },
        },
      );

      const { vacancies, criteria } = data.vacancySearchResult;
      const { totalItems, pages } = data.vacancySearchResult;

      return {
        vacancies: vacancies.map((v) => this.mapVacancy(v)),
        total: totalItems ?? vacancies.length,
        page,
        perPage: criteria.items_on_page,
        pages: pages ?? null,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          error.response?.data ?? 'Ошибка запроса к HH.ru',
          error.response?.status ?? HttpStatus.BAD_GATEWAY,
        );
      }
      throw error;
    }
  }

  private extractCookie(cookieStr: string, name: string): string {
    const match = cookieStr.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match?.[1] ?? '';
  }

  private mapVacancy(v: HhVacancy): VacancyDto {
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
      url: `https://hh.ru/employer/${company.id}`,
      accreditedIt: company.accreditedITEmployer,
    };
  }
}

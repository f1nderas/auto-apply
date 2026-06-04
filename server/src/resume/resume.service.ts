import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ResumeStore } from '../vacancies/resume-store.service';
import { ESSENTIAL_COOKIES } from '../vacancies/constants';
import { HhResumeResponse } from './interfaces/hh-resume.interface';
import { ResumeDto } from './dto/resume.dto';
import { ResumeProfileDto } from './dto/resume-profile.dto';
import { AddResumeProfileDto } from './dto/add-resume-profile.dto';
import { UpdateResumeProfileDto } from './dto/update-resume-profile.dto';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36';

const BROWSER_HEADERS = {
  'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
  'sec-ch-ua':
    '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
};

@Injectable()
export class ResumeService {
  constructor(private readonly resumeStore: ResumeStore) {}

  getProfiles(): ResumeProfileDto[] {
    return this.resumeStore.getAll();
  }

  addProfile(dto: AddResumeProfileDto): void {
    this.resumeStore.upsert(dto.hash, {
      name: dto.name,
      experience: dto.experience,
      cookie: dto.cookie,
      xsrfToken: dto.xsrfToken,
      ...(dto.staticVersion && { staticVersion: dto.staticVersion }),
      ...(dto.baseUrl && { baseUrl: dto.baseUrl }),
    });
  }

  updateProfile(hash: string, dto: UpdateResumeProfileDto): void {
    const patch: Parameters<typeof this.resumeStore.upsert>[1] = {
      name: dto.name,
      experience: dto.experience,
    };

    if (dto.cookie) {
      patch.cookie = dto.cookie;
      patch.xsrfToken = dto.xsrfToken;
      if (dto.staticVersion) patch.staticVersion = dto.staticVersion;
      if (dto.baseUrl) patch.baseUrl = dto.baseUrl;
    }

    this.resumeStore.upsert(hash, patch);
  }

  async getResume(hash: string): Promise<ResumeDto> {
    const {
      cookie: rawCookie,
      xsrfToken,
      baseUrl,
      staticVersion,
    } = this.resumeStore.getSession(hash);
    const cookie = this.filterCookies(rawCookie);
    const fgsscgib = this.extractCookie(rawCookie, 'fgsscgib-w-hh');
    const gsscgib = this.extractCookie(rawCookie, 'gsscgib-w-hh');

    try {
      const { data } = await axios.get<HhResumeResponse>(
        `${baseUrl}/resume/${hash}`,
        {
          headers: {
            ...BROWSER_HEADERS,
            accept: 'application/json',
            referer: `${baseUrl}/applicant/resumes`,
            'user-agent': UA,
            'x-gib-fgsscgib-w-hh': fgsscgib,
            'x-gib-gsscgib-w-hh': gsscgib,
            'x-hhtmfrom': 'resume_list',
            'x-is-spa': 'true',
            'x-requested-with': 'XMLHttpRequest',
            'x-static-version': staticVersion,
            cookie,
            'x-xsrftoken': xsrfToken,
          },
        },
      );
      if (!data.applicantResume) {
        throw new HttpException(
          'Сессия HH.ru истекла — обновите куки через форму сессии',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const r = data.applicantResume;
      return {
        name: `${r.firstName[0]?.string ?? ''} ${r.lastName[0]?.string ?? ''}`.trim(),
        title: r.title[0]?.string ?? '',
        keySkills: r.keySkills.map((k) => k.string),
        about: r.skills[0]?.string ?? '',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data: unknown = error.response?.data;
        const message = typeof data === 'object' && data !== null
          ? ((data as Record<string, unknown>).description as string | undefined)
            ?? ((data as Record<string, unknown>).message as string | undefined)
            ?? 'Ошибка получения резюме'
          : 'Ошибка получения резюме';
        throw new HttpException(message, error.response?.status ?? HttpStatus.BAD_GATEWAY);
      }
      throw error;
    }
  }

  async updateAbout(hash: string, text: string): Promise<void> {
    const {
      cookie: rawCookie,
      xsrfToken,
      baseUrl,
    } = this.resumeStore.getSession(hash);
    const cookie = this.filterCookies(rawCookie);
    const fgsscgib = this.extractCookie(rawCookie, 'fgsscgib-w-hh');
    const gsscgib = this.extractCookie(rawCookie, 'gsscgib-w-hh');

    try {
      await axios.post(
        `${baseUrl}/applicant/resume/edit`,
        { skills: [{ string: text }] },
        {
          params: { resume: hash, hhtmSource: 'resume_partial_edit' },
          headers: {
            ...BROWSER_HEADERS,
            accept: 'application/json',
            'content-type': 'application/json',
            referer: `${baseUrl}/resume/edit/${hash}/about`,
            'user-agent': UA,
            'x-gib-fgsscgib-w-hh': fgsscgib,
            'x-gib-gsscgib-w-hh': gsscgib,
            'x-hhtmfrom': 'resume',
            'x-hhtmsource': 'resume_partial_edit',
            'x-requested-with': 'XMLHttpRequest',
            origin: baseUrl,
            cookie,
            'x-xsrftoken': xsrfToken,
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          error.response?.data ?? 'Ошибка обновления раздела «О себе»',
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

  private filterCookies(cookieStr: string): string {
    return cookieStr
      .split(/;\s*/)
      .filter((pair) => ESSENTIAL_COOKIES.has(pair.split('=')[0]))
      .join('; ');
  }
}

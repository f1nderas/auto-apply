import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { SessionStore } from '../vacancies/session-store.service';
import { ESSENTIAL_COOKIES, HH_STATIC_VERSION } from '../vacancies/constants';
import { HhResumeResponse } from './interfaces/hh-resume.interface';
import { ResumeDto } from './dto/resume.dto';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36';

@Injectable()
export class ResumeService {
  constructor(private readonly sessionStore: SessionStore) {}

  async getResume(): Promise<ResumeDto> {
    const {
      cookie: rawCookie,
      xsrfToken,
      baseUrl,
      resumeHash,
    } = this.sessionStore.get();
    const cookie = this.filterCookies(rawCookie);
    const fgsscgib = this.extractCookie(rawCookie, 'fgsscgib-w-hh');
    const gsscgib = this.extractCookie(rawCookie, 'gsscgib-w-hh');

    try {
      const { data } = await axios.get<HhResumeResponse>(
        `${baseUrl}/resume/${resumeHash}`,
        {
          headers: {
            accept: 'application/json',
            referer: `${baseUrl}/applicant/resumes`,
            'user-agent': UA,
            'x-gib-fgsscgib-w-hh': fgsscgib,
            'x-gib-gsscgib-w-hh': gsscgib,
            'x-hhtmfrom': 'resume_list',
            'x-is-spa': 'true',
            'x-requested-with': 'XMLHttpRequest',
            'x-static-version': HH_STATIC_VERSION,
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
        throw new HttpException(
          error.response?.data ?? 'Ошибка получения резюме',
          error.response?.status ?? HttpStatus.BAD_GATEWAY,
        );
      }
      throw error;
    }
  }

  async updateAbout(text: string): Promise<void> {
    const {
      cookie: rawCookie,
      xsrfToken,
      baseUrl,
      resumeHash,
    } = this.sessionStore.get();
    const cookie = this.filterCookies(rawCookie);
    const fgsscgib = this.extractCookie(rawCookie, 'fgsscgib-w-hh');
    const gsscgib = this.extractCookie(rawCookie, 'gsscgib-w-hh');

    try {
      await axios.post(
        `${baseUrl}/applicant/resume/edit`,
        { skills: [{ string: text }] },
        {
          params: { resume: resumeHash, hhtmSource: 'resume_partial_edit' },
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            referer: `${baseUrl}/resume/edit/${resumeHash}/about`,
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

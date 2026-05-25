import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Session {
  cookie: string;
  xsrfToken: string;
  staticVersion: string;
  baseUrl: string;
}

@Injectable()
export class SessionStore {
  private session: Session;

  constructor(config: ConfigService) {
    this.session = {
      cookie: config.get<string>('HH_COOKIE') ?? '',
      xsrfToken: config.get<string>('HH_XSRF_TOKEN') ?? '',
      staticVersion: '26.22.1.3',
      baseUrl: 'https://hh.ru',
    };
  }

  get(): Session {
    return this.session;
  }

  update(patch: Partial<Session>): void {
    Object.assign(this.session, patch);
  }
}

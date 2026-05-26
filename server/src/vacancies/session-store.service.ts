import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HH_BASE_URL, HH_STATIC_VERSION } from './constants';

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
      staticVersion: HH_STATIC_VERSION,
      baseUrl: HH_BASE_URL,
    };
  }

  get(): Session {
    return this.session;
  }

  update(patch: Partial<Session>): void {
    Object.assign(this.session, patch);
  }
}

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { HH_BASE_URL, HH_STATIC_VERSION } from './constants';

interface Session {
  cookie: string;
  xsrfToken: string;
  staticVersion: string;
  baseUrl: string;
}

interface StoredResume extends Session {
  hash: string;
  name: string;
  experience: number;
}

const RESUMES_FILE = join(process.cwd(), 'resumes.json');
const SESSIONS_FILE = join(process.cwd(), 'sessions.json');

const EMPTY_SESSION: Session = {
  cookie: '',
  xsrfToken: '',
  staticVersion: HH_STATIC_VERSION,
  baseUrl: HH_BASE_URL,
};

@Injectable()
export class ResumeStore {
  private readonly resumes = new Map<string, StoredResume>();

  constructor() {
    this.load();
    this.migrateFromSessionsJson();
  }

  getAll(): Array<{ hash: string; name: string; experience: string }> {
    return [...this.resumes.values()].map(({ hash, name, experience }) => ({
      hash,
      name,
      experience,
    }));
  }

  // Возвращает сессионные данные (куки, токен) для конкретного резюме.
  // Если hash не передан или не найден — возвращает первую доступную сессию.
  getSession(hash?: string): Session {
    if (hash) {
      const r = this.resumes.get(hash);
      if (r) return this.toSession(r);
    }
    const first = [...this.resumes.values()][0];
    return first ? this.toSession(first) : EMPTY_SESSION;
  }

  upsert(hash: string, patch: Partial<StoredResume>): void {
    const existing = this.resumes.get(hash) ?? {
      hash,
      name: '',
      experience: 0,
      ...EMPTY_SESSION,
    };
    this.resumes.set(hash, { ...existing, ...patch, hash });
    this.persist();
  }

  private toSession(r: StoredResume): Session {
    return {
      cookie: r.cookie,
      xsrfToken: r.xsrfToken,
      staticVersion: r.staticVersion,
      baseUrl: r.baseUrl,
    };
  }

  private load(): void {
    if (!existsSync(RESUMES_FILE)) return;
    try {
      const data = JSON.parse(readFileSync(RESUMES_FILE, 'utf8')) as StoredResume[];
      for (const r of data) {
        this.resumes.set(r.hash, { ...{ ...EMPTY_SESSION, name: '', experience: 0 }, ...r });
      }
    } catch {
      // повреждённый файл — стартуем с пустого состояния
    }
  }

  // Однократная миграция: переносит сессии из sessions.json в resumes.json
  private migrateFromSessionsJson(): void {
    if (!existsSync(SESSIONS_FILE)) return;
    try {
      const saved = JSON.parse(readFileSync(SESSIONS_FILE, 'utf8')) as {
        sessions?: Record<string, Partial<Session>>;
      };
      let changed = false;
      for (const [hash, session] of Object.entries(saved.sessions ?? {})) {
        const existing = this.resumes.get(hash);
        // Переносим только если сессии в resumes.json ещё нет или она пустая
        if (!existing?.cookie) {
          this.resumes.set(hash, {
            hash,
            name: existing?.name ?? '',
            experience: existing?.experience ?? '',
            ...EMPTY_SESSION,
            ...session,
          });
          changed = true;
        }
      }
      if (changed) this.persist();
    } catch {
      // молча игнорируем повреждённый sessions.json
    }
  }

  private persist(): void {
    try {
      writeFileSync(
        RESUMES_FILE,
        JSON.stringify([...this.resumes.values()], null, 2),
      );
    } catch {
      // ошибки записи не должны ломать основную логику
    }
  }
}

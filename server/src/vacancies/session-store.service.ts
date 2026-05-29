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

interface PersistedState {
  activeHash: string | null;
  sessions: Record<string, Session>;
}

const SESSIONS_FILE = join(process.cwd(), 'sessions.json');

const EMPTY_SESSION: Session = {
  cookie: '',
  xsrfToken: '',
  staticVersion: HH_STATIC_VERSION,
  baseUrl: HH_BASE_URL,
};

@Injectable()
export class SessionStore {
  private readonly sessions = new Map<string, Session>();
  private activeHash: string | null = null;

  constructor() {
    this.loadFromDisk();
  }

  // Возвращает активную сессию — используется для всех запросов к HH
  get(): Session {
    if (this.activeHash) {
      const s = this.sessions.get(this.activeHash);
      if (s) return s;
    }
    return EMPTY_SESSION;
  }

  getActiveHash(): string | null {
    return this.activeHash;
  }

  setActive(hash: string): void {
    this.activeHash = hash;
    this.persist();
  }

  // Сохраняет/обновляет сессию для конкретного резюме и переключается на неё
  upsert(hash: string, patch: Partial<Session>): void {
    const existing = this.sessions.get(hash) ?? { ...EMPTY_SESSION };
    this.sessions.set(hash, { ...existing, ...patch });
    this.activeHash = hash;
    this.persist();
  }

  listRegisteredHashes(): string[] {
    return [...this.sessions.keys()];
  }

  private loadFromDisk(): void {
    if (!existsSync(SESSIONS_FILE)) return;
    try {
      const saved: PersistedState = JSON.parse(readFileSync(SESSIONS_FILE, 'utf8'));
      this.activeHash = saved.activeHash ?? null;
      for (const [hash, session] of Object.entries(saved.sessions ?? {})) {
        this.sessions.set(hash, session);
      }
    } catch {
      // Повреждённый файл — стартуем с чистого состояния
    }
  }

  private persist(): void {
    try {
      const state: PersistedState = {
        activeHash: this.activeHash,
        sessions: Object.fromEntries(this.sessions),
      };
      writeFileSync(SESSIONS_FILE, JSON.stringify(state, null, 2));
    } catch {
      // Ошибки записи не должны ломать основную логику
    }
  }
}

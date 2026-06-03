import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Injectable } from '@nestjs/common';

const FILE = join(process.cwd(), 'search-history.json');
const LIMIT = 10;

@Injectable()
class SearchHistoryService {
  add(query: string): void {
    const items = this.load();
    const deduped = [query, ...items.filter((q) => q !== query)];
    writeFileSync(FILE, JSON.stringify(deduped.slice(0, LIMIT), null, 2));
  }

  getRecent(): string[] {
    return this.load();
  }

  private load(): string[] {
    if (!existsSync(FILE)) return [];
    try {
      return JSON.parse(readFileSync(FILE, 'utf8')) as string[];
    } catch {
      return [];
    }
  }
}

export { SearchHistoryService };

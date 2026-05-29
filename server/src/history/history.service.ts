import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { AddHistoryItemDto } from './dto/add-history-item.dto';

export interface HistoryRecord extends AddHistoryItemDto {
  appliedAt: string;
}

const HISTORY_FILE = join(process.cwd(), 'apply-history.json');

@Injectable()
export class HistoryService {
  add(dto: AddHistoryItemDto): void {
    const records = this.load();
    records.push({ ...dto, appliedAt: new Date().toISOString() });
    writeFileSync(HISTORY_FILE, JSON.stringify(records, null, 2));
  }

  getAll(): HistoryRecord[] {
    return this.load();
  }

  private load(): HistoryRecord[] {
    if (!existsSync(HISTORY_FILE)) return [];
    try {
      return JSON.parse(readFileSync(HISTORY_FILE, 'utf8')) as HistoryRecord[];
    } catch {
      return [];
    }
  }
}

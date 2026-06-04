import { Injectable, ConflictException } from '@nestjs/common';
import { VacanciesService } from '../vacancies/vacancies.service';
import { HistoryService } from '../history/history.service';
import { SearchHistoryService } from '../search-history/search-history.service';
import { StartAutoApplyDto } from './dto/start-auto-apply.dto';
import { VacancyDto } from '../vacancies/dto/vacancy-response.dto';

const APPLY_DELAY_MS = 2000;
// Берём чуть больше вакансий чем нужно — часть может быть уже откликнута или требовать тест
const perPage = (count: number) => Math.min(count * 2 + 20, 100);

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Emitter = (event: string, data: unknown) => void;

@Injectable()
class AutoApplyService {
  private isRunning = false;
  private done = 0;
  private total = 0;
  private abortController: AbortController | null = null;
  private emit: Emitter = () => {};

  constructor(
    private readonly vacanciesService: VacanciesService,
    private readonly historyService: HistoryService,
    private readonly searchHistoryService: SearchHistoryService,
  ) {}

  setEmitter(emit: Emitter): void {
    this.emit = emit;
  }

  getStatus() {
    return { isRunning: this.isRunning, done: this.done, total: this.total };
  }

  start(dto: StartAutoApplyDto): void {
    if (this.isRunning) throw new ConflictException('Автоотклик уже запущен');

    this.searchHistoryService.add(dto.text);
    this.isRunning = true;
    this.done = 0;
    this.total = 0;
    this.abortController = new AbortController();

    this.runLoop(dto, this.abortController.signal).catch((err: Error) => {
      this.emit('error', { message: err.message });
      this.isRunning = false;
    });
  }

  stop(): void {
    this.abortController?.abort();
  }

  private async runLoop(
    dto: StartAutoApplyDto,
    signal: AbortSignal,
  ): Promise<void> {
    const {
      text,
      area,
      count,
      resumeHashes,
      searchFields,
      workFormat,
      coverLetter,
      sendLetterToAll,
    } = dto;

    try {
      const searchResult = await this.vacanciesService.search({
        text,
        area,
        page: 0,
        perPage: perPage(count),
        resumeHash: resumeHashes[0],
        searchFields,
        workFormat,
      });

      const candidates = searchResult.vacancies
        .filter(
          (v) =>
            !v.applicationStatus &&
            (!v.responseLetterRequired || !!coverLetter),
        )
        .slice(0, count);

      if (candidates.length === 0) {
        this.emit('error', { message: 'Нет подходящих вакансий для отклика' });
        return;
      }

      this.total = candidates.length * resumeHashes.length;
      this.emit('progress', { done: 0, total: this.total });

      const pairs = resumeHashes.flatMap((resumeHash) =>
        candidates.map((vacancy) => ({ resumeHash, vacancy })),
      );

      for (const { resumeHash, vacancy } of pairs) {
        if (signal.aborted) {
          this.emit('done', {
            done: this.done,
            total: this.total,
            aborted: true,
          });
          return;
        }

        await sleep(APPLY_DELAY_MS);
        await this.applyAndRecord(vacancy, resumeHash, coverLetter, sendLetterToAll === true);
      }

      this.emit('done', { done: this.done, total: this.total, aborted: false });
    } finally {
      this.isRunning = false;
    }
  }

  private async applyAndRecord(
    vacancy: VacancyDto,
    resumeHash: string,
    coverLetter: string | undefined,
    sendLetterToAll: boolean,
  ): Promise<void> {
    let success = false;
    let topicId: string | null = null;
    try {
      const result = await this.vacanciesService.apply({
        vacancyId: vacancy.id,
        resumeHash,
        ...(vacancy.responseLetterRequired && coverLetter
          ? { letter: coverLetter }
          : {}),
      });
      success = result.ok;
      topicId = result.topicId;
    } catch {
      // ошибка фиксируется как failed
    }

    // Для quickResponse + sendLetterToAll: добавляем письмо через edit_ajax
    let letterAdded: boolean | undefined;
    if (success && !vacancy.responseLetterRequired && sendLetterToAll && coverLetter && topicId) {
      letterAdded = await this.vacanciesService.addLetterToResponse(topicId, coverLetter, resumeHash);
    }

    this.historyService.add({
      vacancyId: vacancy.id,
      vacancyName: vacancy.name,
      employer: vacancy.employer.name,
      status: success ? 'success' : 'failed',
      resumeHash,
    });

    this.done++;
    this.emit('apply:result', {
      vacancyId: vacancy.id,
      vacancyName: vacancy.name,
      resumeHash,
      success,
      letterAdded,
    });
    this.emit('progress', { done: this.done, total: this.total });
  }
}

export { AutoApplyService };

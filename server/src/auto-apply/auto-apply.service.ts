import { Injectable, ConflictException } from '@nestjs/common';
import { VacanciesService } from '../vacancies/vacancies.service';
import { HistoryService } from '../history/history.service';
import { StartAutoApplyDto } from './dto/start-auto-apply.dto';

const APPLY_DELAY_MS = 2000;

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
  ) {}

  setEmitter(emit: Emitter): void {
    this.emit = emit;
  }

  getStatus() {
    return { isRunning: this.isRunning, done: this.done, total: this.total };
  }

  start(dto: StartAutoApplyDto): void {
    if (this.isRunning) throw new ConflictException('Автоотклик уже запущен');

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
    try {
      const searchResult = await this.vacanciesService.search({
        text: dto.text,
        area: dto.area,
        page: 0,
        perPage: Math.min(dto.count * 2 + 20, 100),
        resumeHash: dto.resumeHashes[0],
      });

      const candidates = searchResult.vacancies
        .filter((v) => !v.applicationStatus && !v.responseLetterRequired)
        .slice(0, dto.count);

      if (candidates.length === 0) {
        this.emit('error', { message: 'Нет подходящих вакансий для отклика' });
        return;
      }

      this.total = candidates.length * dto.resumeHashes.length;
      this.emit('progress', { done: 0, total: this.total });

      for (const resumeHash of dto.resumeHashes) {
        for (const vacancy of candidates) {
          if (signal.aborted) {
            this.emit('done', {
              done: this.done,
              total: this.total,
              aborted: true,
            });
            return;
          }

          await sleep(APPLY_DELAY_MS);

          let success = false;
          try {
            const result = await this.vacanciesService.apply({
              vacancyId: vacancy.id,
              resumeHash,
            });
            success = result.ok;
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(
              `[auto-apply] apply failed vacancyId=${vacancy.id}:`,
              message,
            );
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
          });
          this.emit('progress', { done: this.done, total: this.total });
        }
      }

      this.emit('done', { done: this.done, total: this.total, aborted: false });
    } finally {
      this.isRunning = false;
    }
  }
}

export { AutoApplyService };

import { Module } from '@nestjs/common';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { SessionStore } from './session-store.service';

@Module({
  controllers: [VacanciesController],
  providers: [VacanciesService, SessionStore],
  exports: [SessionStore],
})
export class VacanciesModule {}

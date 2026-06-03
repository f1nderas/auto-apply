import { Module } from '@nestjs/common';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { ResumeStore } from './resume-store.service';

@Module({
  controllers: [VacanciesController],
  providers: [VacanciesService, ResumeStore],
  exports: [VacanciesService, ResumeStore],
})
export class VacanciesModule {}

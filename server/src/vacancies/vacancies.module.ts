import { Module } from '@nestjs/common';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';

/**
 * Модуль вакансий.
 * Отвечает за получение и форматирование списка вакансий с HH.ru.
 */
@Module({
  controllers: [VacanciesController],
  providers: [VacanciesService],
})
export class VacanciesModule {}

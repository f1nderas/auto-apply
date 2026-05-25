import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { VacanciesModule } from '../vacancies/vacancies.module';

@Module({
  imports: [VacanciesModule],
  controllers: [AdminController],
})
export class AdminModule {}

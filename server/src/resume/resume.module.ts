import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { VacanciesModule } from '../vacancies/vacancies.module';

@Module({
  imports: [VacanciesModule],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}

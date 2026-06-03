import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VacanciesModule } from './vacancies/vacancies.module';
import { AdminModule } from './admin/admin.module';
import { ResumeModule } from './resume/resume.module';
import { HistoryModule } from './history/history.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { AutoApplyModule } from './auto-apply/auto-apply.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    VacanciesModule,
    AdminModule,
    ResumeModule,
    HistoryModule,
    SuggestionsModule,
    AutoApplyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

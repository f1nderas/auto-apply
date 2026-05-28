import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VacanciesModule } from './vacancies/vacancies.module';
import { AdminModule } from './admin/admin.module';
import { ResumeModule } from './resume/resume.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    VacanciesModule,
    AdminModule,
    ResumeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

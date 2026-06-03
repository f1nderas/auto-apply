import { Module } from '@nestjs/common';
import { VacanciesModule } from '../vacancies/vacancies.module';
import { HistoryModule } from '../history/history.module';
import { AutoApplyService } from './auto-apply.service';
import { AutoApplyGateway } from './auto-apply.gateway';
import { AutoApplyController } from './auto-apply.controller';

@Module({
  imports: [VacanciesModule, HistoryModule],
  providers: [AutoApplyService, AutoApplyGateway],
  controllers: [AutoApplyController],
})
class AutoApplyModule {}

export { AutoApplyModule };

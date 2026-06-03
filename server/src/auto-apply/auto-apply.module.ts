import { Module } from '@nestjs/common';
import { VacanciesModule } from '../vacancies/vacancies.module';
import { HistoryModule } from '../history/history.module';
import { SearchHistoryModule } from '../search-history/search-history.module';
import { AutoApplyService } from './auto-apply.service';
import { AutoApplyGateway } from './auto-apply.gateway';
import { AutoApplyController } from './auto-apply.controller';

@Module({
  imports: [VacanciesModule, HistoryModule, SearchHistoryModule],
  providers: [AutoApplyService, AutoApplyGateway],
  controllers: [AutoApplyController],
})
class AutoApplyModule {}

export { AutoApplyModule };

import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuggestionsService } from './suggestions.service';

@ApiTags('Suggestions')
@Controller('suggestions')
class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Get()
  @ApiQuery({ name: 'query', type: String, required: false })
  @ApiResponse({ status: 200, type: [String] })
  getVacancyNames(@Query('query') query?: string): string[] {
    return this.suggestionsService.getVacancyNames(query);
  }
}

export { SuggestionsController };

import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { SearchHistoryService } from './search-history.service';
import { AddSearchQueryDto } from './dto/add-search-query.dto';

@ApiTags('SearchHistory')
@Controller('search-history')
class SearchHistoryController {
  constructor(private readonly searchHistoryService: SearchHistoryService) {}

  @Get()
  @ApiResponse({ status: 200, type: [String] })
  getRecent(): string[] {
    return this.searchHistoryService.getRecent();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200 })
  add(@Body() dto: AddSearchQueryDto): void {
    this.searchHistoryService.add(dto.query);
  }
}

export { SearchHistoryController };

import { Controller, Delete, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { AddHistoryItemDto } from './dto/add-history-item.dto';

@ApiTags('History')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @ApiBody({ type: AddHistoryItemDto })
  @ApiResponse({ status: 201 })
  add(@Body() dto: AddHistoryItemDto): void {
    this.historyService.add(dto);
  }

  @Get()
  @ApiResponse({ status: 200 })
  getAll() {
    return this.historyService.getAll();
  }

  @Delete()
  @ApiResponse({ status: 200 })
  clear(): void {
    this.historyService.clear();
  }
}

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AutoApplyService } from './auto-apply.service';
import { StartAutoApplyDto } from './dto/start-auto-apply.dto';

@ApiTags('AutoApply')
@Controller('auto-apply')
class AutoApplyController {
  constructor(private readonly autoApplyService: AutoApplyService) {}

  @Post('start')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Задача запущена' })
  @ApiResponse({ status: 409, description: 'Задача уже выполняется' })
  start(@Body() dto: StartAutoApplyDto): void {
    this.autoApplyService.start(dto);
  }

  @Post('stop')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Задача остановлена' })
  stop(): void {
    this.autoApplyService.stop();
  }
}

export { AutoApplyController };

import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ResumeService } from './resume.service';
import { ResumeDto, UpdateAboutDto } from './dto/resume.dto';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get(':hash')
  @ApiParam({ name: 'hash', type: String })
  @ApiResponse({ status: 200, type: ResumeDto })
  getResume(@Param('hash') hash: string): Promise<ResumeDto> {
    return this.resumeService.getResume(hash);
  }

  @Patch(':hash/about')
  @ApiParam({ name: 'hash', type: String })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: UpdateAboutDto })
  updateAbout(
    @Param('hash') hash: string,
    @Body() dto: UpdateAboutDto,
  ): Promise<void> {
    return this.resumeService.updateAbout(hash, dto.text);
  }
}

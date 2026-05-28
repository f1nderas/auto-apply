import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResumeService } from './resume.service';
import { ResumeDto, UpdateAboutDto } from './dto/resume.dto';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  @ApiResponse({ status: 200, type: ResumeDto })
  getResume(): Promise<ResumeDto> {
    return this.resumeService.getResume();
  }

  @Patch('about')
  @ApiResponse({ status: 200 })
  @ApiBody({ type: UpdateAboutDto })
  updateAbout(@Body() dto: UpdateAboutDto): Promise<void> {
    return this.resumeService.updateAbout(dto.text);
  }
}

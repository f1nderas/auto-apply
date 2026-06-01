import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ResumeService } from './resume.service';
import { ResumeDto, UpdateAboutDto } from './dto/resume.dto';
import { ResumeProfileDto } from './dto/resume-profile.dto';
import { AddResumeProfileDto } from './dto/add-resume-profile.dto';
import { UpdateResumeProfileDto } from './dto/update-resume-profile.dto';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  @ApiResponse({ status: 200, type: [ResumeProfileDto] })
  getProfiles(): ResumeProfileDto[] {
    return this.resumeService.getProfiles();
  }

  @Post()
  @ApiBody({ type: AddResumeProfileDto })
  @ApiResponse({ status: 201 })
  addProfile(@Body() dto: AddResumeProfileDto): void {
    this.resumeService.addProfile(dto);
  }

  @Patch(':hash/profile')
  @ApiParam({ name: 'hash', type: String })
  @ApiBody({ type: UpdateResumeProfileDto })
  @ApiResponse({ status: 200 })
  updateProfile(
    @Param('hash') hash: string,
    @Body() dto: UpdateResumeProfileDto,
  ): void {
    this.resumeService.updateProfile(hash, dto);
  }

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

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ApplyVacancyDto {
  @ApiProperty()
  @IsString()
  vacancyId: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  letter?: string;
}

export class ApplyResponseDto {
  @ApiProperty()
  ok: boolean;

  @ApiPropertyOptional({ type: String, nullable: true })
  topicId: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  chatId: string | null;
}

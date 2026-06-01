import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddHistoryItemDto {
  @IsString()
  @ApiProperty()
  vacancyId: string;

  @IsString()
  @ApiProperty()
  vacancyName: string;

  @IsString()
  @ApiProperty()
  employer: string;

  @IsIn(['success', 'failed'])
  @ApiProperty({ enum: ['success', 'failed'] })
  status: 'success' | 'failed';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  resumeHash?: string;
}

export { AddHistoryItemDto };

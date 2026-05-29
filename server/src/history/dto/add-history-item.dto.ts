import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}

export { AddHistoryItemDto };

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsInt,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';

class StartAutoApplyDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ description: '0 = без фильтра по региону' })
  @IsNumber()
  area: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  count: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  resumeHashes: string[];

  @ApiPropertyOptional({ type: [String], example: ['name', 'description'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchFields?: string[];

  @ApiPropertyOptional({ type: String, example: 'REMOTE' })
  @IsOptional()
  @IsString()
  workFormat?: string;
}

export { StartAutoApplyDto };

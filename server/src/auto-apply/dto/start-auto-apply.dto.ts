import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsArray, Min } from 'class-validator';

class StartAutoApplyDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
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
}

export { StartAutoApplyDto };

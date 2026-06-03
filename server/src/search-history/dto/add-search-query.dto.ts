import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

class AddSearchQueryDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  query: string;
}

export { AddSearchQueryDto };

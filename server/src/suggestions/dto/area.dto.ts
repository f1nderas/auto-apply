import { ApiProperty } from '@nestjs/swagger';

class AreaDto {
  @ApiProperty()
  value: number;

  @ApiProperty()
  label: string;
}

export { AreaDto };

import { ApiProperty } from '@nestjs/swagger';

class ResumeProfileDto {
  @ApiProperty()
  hash: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ example: 3.5 })
  experience: number;
}

export { ResumeProfileDto };

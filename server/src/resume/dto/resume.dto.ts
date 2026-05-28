import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class ResumeDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: [String] })
  keySkills: string[];

  @ApiProperty()
  about: string;
}

class UpdateAboutDto {
  @ApiProperty()
  @IsString()
  text: string;
}

export { ResumeDto, UpdateAboutDto };

import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class AddResumeProfileDto {
  @IsString()
  @ApiProperty({ example: '08a5aea1ff1024b7b80039ed1f69426f49744f' })
  hash: string;

  @IsString()
  @ApiProperty({ example: 'Иван Иванов' })
  name: string;

  @IsNumber()
  @ApiProperty({ example: 3.5, description: 'Количество лет опыта' })
  experience: number;

  @IsString()
  @ApiProperty({ description: 'cURL из DevTools для привязки сессии' })
  curl: string;
}

export { AddResumeProfileDto };

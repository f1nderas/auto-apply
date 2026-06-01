import { ApiProperty } from '@nestjs/swagger';

class HistoryStatsDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  success: number;

  @ApiProperty()
  failed: number;
}

export { HistoryStatsDto };

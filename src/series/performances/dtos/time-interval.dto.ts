import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class TimeIntervalDto {
  @IsString()
  @Matches(/^([0-5][0-9]):([0-5][0-9])$/, {
    message: 'Invalid interval format (MM:SS)',
  })
  @ApiProperty({
    description: 'Hora de inicio del intervalo (MM:SS)',
    example: '00:00',
  })
  start: string;

  @IsString()
  @Matches(/^([0-5][0-9]):([0-5][0-9])$/, {
    message: 'Invalid interval format (MM:SS)',
  })
  @ApiProperty({
    description: 'Hora de finalización del intervalo (MM:SS)',
    example: '00:30',
  })
  end: string;
}

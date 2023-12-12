import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TimeIntervalDto } from './time-interval.dto';

export class UpdatePerformanceDto {
  @IsOptional()
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID del episodio al que pertenece el rendimiento',
    example: '60f72a1c50b983001f5a9f3b',
  })
  episodeId?: string;

  @IsOptional()
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID del personaje asociado al rendimiento',
    example: '60f72a1c50b983001f5a9f3a',
  })
  characterId?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TimeIntervalDto)
  @ApiProperty({
    description: 'Intervalo de tiempo en el que ocurre el rendimiento',
    example: { start: '00:10', end: '00:30' },
  })
  interval?: TimeIntervalDto;
}

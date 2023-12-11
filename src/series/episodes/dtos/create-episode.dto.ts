import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEpisodeDto {
  @ApiProperty({ description: 'Name of the episode' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: false, description: 'Season of the episode' })
  @IsString()
  @IsOptional()
  readonly season?: string;
}

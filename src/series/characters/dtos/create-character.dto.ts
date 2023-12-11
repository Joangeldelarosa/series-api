import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsObject,
  IsUrl,
} from 'class-validator';

export class CreateCharacterDto {
  @ApiProperty({ required: false, description: 'ID of the character' })
  @IsNumber()
  @IsOptional()
  readonly id?: number;

  @ApiProperty({ description: 'Name of the character' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: false, description: 'Status of the character' })
  @IsString()
  @IsOptional()
  readonly status?: string;

  @ApiProperty({ description: 'Specie of the character' })
  @IsString()
  readonly specie: string;

  @ApiProperty({ required: false, description: 'Type of the character' })
  @IsString()
  @IsOptional()
  readonly type?: string;

  @ApiProperty({ required: false, description: 'Gender of the character' })
  @IsString()
  @IsOptional()
  readonly gender?: string;

  @ApiProperty({ required: false, description: 'Origin of the character' })
  @IsObject()
  @IsOptional()
  readonly origin?: any;

  @ApiProperty({ required: false, description: 'Location of the character' })
  @IsObject()
  @IsOptional()
  readonly location?: any;

  @ApiProperty({ required: false, description: 'Image URL of the character' })
  @IsUrl()
  @IsOptional()
  readonly image?: string;

  @ApiProperty({ required: false, description: 'URL of the character' })
  @IsUrl()
  @IsOptional()
  readonly url?: string;

  @ApiProperty({
    required: false,
    description: 'Creation date of the character',
  })
  @IsOptional()
  readonly created?: Date;
}

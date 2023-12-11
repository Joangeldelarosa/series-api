import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UsePipes,
  HttpCode,
} from '@nestjs/common';
import { CharactersService } from '../services/characters.service';
import { CreateCharacterDto } from '../dtos/create-character.dto';
import { UpdateCharacterDto } from '../dtos/update-character.dto';
import { Character } from 'src/series/entities/character.entity';
import { ApiTags, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-validation.pipe';

@ApiTags('characters') // Etiqueta para agrupar en Swagger
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create a new character',
  })
  @ApiBody({ type: CreateCharacterDto })
  @HttpCode(201)
  async create(
    @Body() createCharacterDto: CreateCharacterDto,
  ): Promise<Character> {
    return this.charactersService.create(createCharacterDto);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({
    status: 200,
    description: 'Update a character',
  })
  @ApiBody({ type: UpdateCharacterDto })
  @HttpCode(200)
  @UsePipes(new ObjectIdValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    return this.charactersService.update(id, updateCharacterDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 204, description: 'Remove a character' })
  @HttpCode(204)
  @UsePipes(new ObjectIdValidationPipe())
  async remove(@Param('id') id: string): Promise<void> {
    await this.charactersService.remove(id);
  }
}

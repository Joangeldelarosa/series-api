import {
  Controller,
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
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { ValidCategoryPipe } from 'src/common/pipes/valid-category.pipe';
import { UniqueCharacterNamePipe } from 'src/common/pipes/unique-character-name.pipe';

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
  @UsePipes(ValidCategoryPipe, UniqueCharacterNamePipe)
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
  @UsePipes(ObjectIdValidationPipe, ValidCategoryPipe, UniqueCharacterNamePipe)
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
  @UsePipes(ObjectIdValidationPipe)
  async remove(@Param('id') id: string): Promise<void> {
    await this.charactersService.remove(id);
  }
}

import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UsePipes,
  HttpCode,
  Query,
  Get,
} from '@nestjs/common';
import { CharactersService } from '../services/characters.service';
import { CreateCharacterDto } from '../dtos/create-character.dto';
import { UpdateCharacterDto } from '../dtos/update-character.dto';
import { Character } from 'src/series/entities/character.entity';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { ValidCategoryPipe } from 'src/common/pipes/valid-category.pipe';
import { UniqueCharacterNamePipe } from 'src/common/pipes/unique-character-name.pipe';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get characters with pagination and filters',
    description:
      'Retrieve a list of characters with optional pagination and filters.',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination.',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'specie',
    description: 'Filter characters by specie.',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'type',
    description: 'Filter characters by type.',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved characters.',
  })
  @HttpCode(200)
  async findAll(
    @Query('page') page: number,
    @Query('specie') specie: string,
    @Query('type') type: string,
  ): Promise<any> {
    return this.charactersService.findAll(page, specie, type);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new character',
    description: 'Create a new character with the provided data.',
  })
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
  @ApiOperation({
    summary: 'Update a character',
    description: 'Update a character with the provided data.',
  })
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
  @ApiOperation({
    summary: 'Remove a character',
    description: 'Remove a character with the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 204, description: 'Remove a character' })
  @HttpCode(204)
  @UsePipes(ObjectIdValidationPipe)
  async remove(@Param('id') id: string): Promise<void> {
    await this.charactersService.remove(id);
  }

  @Get('types')
  @ApiOperation({
    summary: 'Get all character types',
    description: 'Retrieve a list of all character types.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved character types.',
  })
  @HttpCode(200)
  async getTypes(): Promise<string[]> {
    return this.charactersService.getCharactersTypes();
  }

  @Get('species')
  @ApiOperation({
    summary: 'Get all character species',
    description: 'Retrieve a list of all character species.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved character species.',
  })
  @HttpCode(200)
  async getSpecies(): Promise<string[]> {
    return this.charactersService.getCharactersSpecies();
  }
}

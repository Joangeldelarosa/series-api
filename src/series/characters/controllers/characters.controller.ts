import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UsePipes,
  UseGuards,
  HttpCode,
  ValidationPipe,
  Query,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { ValidCategoryPipe } from 'src/common/pipes/valid-category.pipe';
import { UniqueCharacterNamePipe } from 'src/common/pipes/unique-character-name.pipe';

@ApiTags('Characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  // ANCHOR Get/Find all characters
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

  // ANCHOR Create a character
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe, ValidCategoryPipe, UniqueCharacterNamePipe)
  @HttpCode(201)
  async create(
    @Body() createCharacterDto: CreateCharacterDto,
  ): Promise<Character> {
    return this.charactersService.create(createCharacterDto);
  }

  // ANCHOR Update a character
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
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(
    ValidationPipe,
    ObjectIdValidationPipe,
    ValidCategoryPipe,
    UniqueCharacterNamePipe,
  )
  async update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    return this.charactersService.update(id, updateCharacterDto);
  }

  // ANCHOR Remove a character
  @Delete(':id')
  @ApiOperation({
    summary: 'Remove a character',
    description: 'Remove a character with the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 204, description: 'Remove a character' })
  @ApiBearerAuth()
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ObjectIdValidationPipe)
  async remove(@Param('id') id: string): Promise<void> {
    await this.charactersService.remove(id);
  }

  // ANCHOR Get character types
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

  // ANCHOR Get character species
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

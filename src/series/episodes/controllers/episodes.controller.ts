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
import { EpisodesService } from '../services/episodes.service';
import { CreateEpisodeDto } from '../dtos/create-episode.dto';
import { UpdateEpisodeDto } from '../dtos/update-episode.dto';
import { Episode } from 'src/series/entities/episode.entity';
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
import { UniqueEpisodeNamePipe } from 'src/common/pipes/unique-episode-name.pipe';

@ApiTags('Episodes')
@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  // ANCHOR Get/Find all episodes
  @Get()
  @ApiOperation({
    summary: 'Get episodes with pagination and filters',
    description:
      'Retrieve a list of episodes with optional pagination and filters.',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination.',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'season',
    description: 'Filter episodes by season.',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved episodes.',
  })
  @HttpCode(200)
  async findAll(
    @Query('page') page: number,
    @Query('season') season: string,
  ): Promise<any> {
    return this.episodesService.findAll(page, season);
  }

  // ANCHOR Create an episode
  @Post()
  @ApiOperation({
    summary: 'Create a new episode',
    description: 'Create a new episode with the provided data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Create a new episode',
  })
  @ApiBody({ type: CreateEpisodeDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe, ValidCategoryPipe, UniqueEpisodeNamePipe)
  @HttpCode(201)
  async create(@Body() createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    return this.episodesService.create(createEpisodeDto);
  }

  // ANCHOR Update an episode
  @Patch(':id')
  @ApiOperation({
    summary: 'Update an episode',
    description: 'Update an episode with the provided data.',
  })
  @ApiParam({ name: 'id', description: 'Episode ID' })
  @ApiResponse({
    status: 200,
    description: 'Update an episode',
  })
  @ApiBody({ type: UpdateEpisodeDto })
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(
    ValidationPipe,
    ObjectIdValidationPipe,
    ValidCategoryPipe,
    UniqueEpisodeNamePipe,
  )
  async update(
    @Param('id') id: string,
    @Body() updateEpisodeDto: UpdateEpisodeDto,
  ): Promise<Episode> {
    return this.episodesService.update(id, updateEpisodeDto);
  }

  // ANCHOR Remove an episode
  @Delete(':id')
  @ApiOperation({
    summary: 'Remove an episode',
    description: 'Remove an episode with the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'Episode ID' })
  @ApiResponse({ status: 204, description: 'Remove an episode' })
  @ApiBearerAuth()
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ObjectIdValidationPipe)
  async remove(@Param('id') id: string): Promise<void> {
    await this.episodesService.remove(id);
  }

  // ANCHOR Get episode seasons
  @Get('seasons')
  @ApiOperation({
    summary: 'Get all episode seasons',
    description: 'Retrieve a list of all episode seasons.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved episode seasons.',
  })
  @HttpCode(200)
  async getSeasons(): Promise<string[]> {
    return this.episodesService.getEpisodesSeasons();
  }
}

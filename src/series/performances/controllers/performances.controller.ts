import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UsePipes,
  HttpCode,
  ValidationPipe,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PerformancesService } from '../services/performances.service';
import { CreatePerformanceDto } from '../dtos/create-performance.dto';
import { UpdatePerformanceDto } from '../dtos/update-performance.dto';
import { Performance } from 'src/series/entities/performance.entity';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { PerformanceValidationInterceptor } from 'src/common/interceptors/performance-validation.interceptor';
import { ResponseEntity } from 'src/common/entities/response.entity';

@ApiTags('Performances')
@Controller('performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  // ANCHOR Create Performance
  @Post()
  @ApiOperation({
    summary: 'Create a new performance',
    description: 'Create a new performance with the provided data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Create a new performance',
  })
  @ApiBody({ type: CreatePerformanceDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  @UseInterceptors(PerformanceValidationInterceptor)
  @HttpCode(201)
  async create(
    @Body() createPerformanceDto: CreatePerformanceDto,
  ): Promise<Performance> {
    return this.performancesService.create(createPerformanceDto);
  }

  // ANCHOR Update Performance
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a performance',
    description: 'Update a performance with the provided data.',
  })
  @ApiParam({ name: 'id', description: 'Performance ID' })
  @ApiResponse({
    status: 200,
    description: 'Update a performance',
  })
  @ApiBody({ type: UpdatePerformanceDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe, ObjectIdValidationPipe)
  @UseInterceptors(PerformanceValidationInterceptor)
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updatePerformanceDto: UpdatePerformanceDto,
  ): Promise<Performance> {
    return this.performancesService.update(id, updatePerformanceDto);
  }

  // ANCHOR Remove Performance
  @Delete(':id')
  @ApiOperation({
    summary: 'Remove a performance',
    description: 'Remove a performance with the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'Performance ID' })
  @ApiResponse({ status: 204, description: 'Remove a performance' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ObjectIdValidationPipe)
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.performancesService.remove(id);
  }

  // ANCHOR Validate Episode
  @Get(':episodeId/validate')
  @ApiOperation({
    summary: 'Validate performances in an episode',
    description: 'Validate if the performances in an episode are correct.',
  })
  @ApiParam({ name: 'episodeId', description: 'Episode ID' })
  @ApiResponse({
    status: 200,
    description: 'Validation successful',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async validateEpisode(
    @Param('episodeId') episodeId: string,
  ): Promise<ResponseEntity> {
    const isValid = await this.performancesService.isValidEpisodePerformances(
      episodeId,
    );

    if (!isValid) {
      const res: ResponseEntity = {
        error: 'The performances in this episode are not valid.',
      };

      return res;
    }

    const res: ResponseEntity = {
      message: 'The performances in this episode are valid.',
    };

    return res;
  }

  // ANCHOR Remove Character from Episode
  @Delete(':episodeId/characters/:characterId')
  @ApiOperation({
    summary: 'Remove performances of a character in an episode',
    description: 'Remove all performances of a character in an episode.',
  })
  @ApiParam({ name: 'episodeId', description: 'Episode ID' })
  @ApiParam({ name: 'characterId', description: 'Character ID' })
  @ApiResponse({
    status: 204,
    description: 'Remove a character from an episode',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ObjectIdValidationPipe)
  @HttpCode(204)
  async removeCharacterFromEpisode(
    @Param('episodeId') episodeId: string,
    @Param('characterId') characterId: string,
  ): Promise<void> {
    await this.performancesService.removeCharacterFromPerformances(
      characterId,
      episodeId,
    );
  }
}

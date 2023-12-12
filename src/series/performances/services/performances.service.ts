import { Injectable, NotFoundException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Performance } from 'src/series/entities/performance.entity';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CreatePerformanceDto } from '../dtos/create-performance.dto';
import { UpdatePerformanceDto } from '../dtos/update-performance.dto';
import {
  timeToSeconds,
  validateEpisodePerformances,
} from 'src/common/utils/time-tools';
import { Episode } from 'src/series/entities/episode.entity';
import { Character } from 'src/series/entities/character.entity';
import { Status } from 'src/series/entities/status.entity';

@Injectable()
export class PerformancesService {
  constructor(
    @InjectModel('Performance') private performanceModel: Model<Performance>,
    @InjectModel('Episode') private episodeModel: Model<Episode>,
    @InjectModel('Character') private characterModel: Model<Character>,
    @InjectModel('Status') private statusModel: Model<Status>,
  ) {}

  // ANCHOR Create Performance
  async create(
    createPerformanceDto: CreatePerformanceDto,
  ): Promise<Performance> {
    const { episodeId, characterId } = createPerformanceDto;

    // find characer and episode
    const episode = await this.episodeModel.findById(episodeId);
    const character = await this.characterModel.findById(characterId);

    const createdPerformance = await this.performanceModel.create({
      ...createPerformanceDto,
      episode: episode._id,
      character: character._id,
    });

    // Actualizar el tiempo máximo de segundos utilizados en el episodio
    await this.updateEpisodeDuration(episodeId);

    return createdPerformance;
  }

  // ANCHOR Update Performance
  async update(
    id: string,
    updatePerformanceDto: UpdatePerformanceDto,
  ): Promise<Performance> {
    const performance = await this.performanceModel.findByIdAndUpdate(
      { _id: id },
      updatePerformanceDto,
      { new: true },
    );

    if (!performance) {
      throw new NotFoundException('Performance not found');
    }

    // Actualizar el tiempo máximo de segundos utilizados en el episodio
    await this.updateEpisodeDuration(performance.episode._id.toString());

    return performance;
  }

  // ANCHOR Remove Performance by id
  async remove(id: string): Promise<boolean> {
    const performance = await this.performanceModel.findById(id);

    if (!performance) {
      throw new NotFoundException('Performance not found');
    }

    await this.performanceModel.findOneAndDelete({ _id: id });

    await this.updateEpisodeDuration(performance.episode.toString());

    return true;
  }

  // ANCHOR Remove Character from episode
  async removeCharacterFromPerformances(
    characterId: string,
    episodeId: string,
  ): Promise<boolean> {
    await this.performanceModel.deleteMany({
      character: characterId,
      episode: episodeId,
    });

    await this.updateEpisodeDuration(episodeId);

    return true;
  }

  // ANCHOR Update Episode Duration
  private async updateEpisodeDuration(episodeId: string): Promise<void> {
    // Obtener todas las participaciones del episodio
    const performances = await this.performanceModel
      .find({ episode: episodeId })
      .sort({ 'interval.start': 1 });

    let maxSeconds = 0;

    for (const performance of performances) {
      const seconds = timeToSeconds(performance.interval.end);
      if (seconds > maxSeconds) {
        maxSeconds = seconds;
      }
    }

    // Actualizar el tiempo máximo de segundos utilizados en el episodio
    await this.episodeModel.findByIdAndUpdate(episodeId, {
      duration: maxSeconds,
    });

    return;
  }

  // ANCHOR Verify is valid episode performances
  async isValidEpisodePerformances(episodeId: string): Promise<boolean> {
    const performances = await this.performanceModel
      .find({ episode: episodeId })
      .sort({ 'interval.start': 1 });

    const res = await validateEpisodePerformances(performances);
    return res;
  }

  // ANCHOR Find All Performances by Episode
  async findAllByEpisode(
    page: number | string,
    episodeId: string,
    characterId?: string,
    currentStatus?: string,
  ): Promise<ResponseEntity> {
    page = page ? (typeof page === 'string' ? parseInt(page) : page) : 1;
    page = page < 1 ? 1 : page;

    const limit = 5;
    const skip = (page - 1) * limit;

    const aggregationPipeline: any[] = [];

    // Match stage to filter by episodeId and characterId
    aggregationPipeline.push({
      $match: {
        episode: new mongoose.Types.ObjectId(episodeId),
        ...(characterId && {
          character: new mongoose.Types.ObjectId(characterId),
        }),
      },
    });

    // Lookup stage to populate 'character'
    aggregationPipeline.push({
      $lookup: {
        from: 'characters',
        localField: 'character',
        foreignField: '_id',
        as: 'character',
      },
    });

    // Unwind 'character' array created by $lookup
    aggregationPipeline.push({
      $unwind: '$character',
    });

    // Lookup stage to populate 'character.currentStatus'
    if (currentStatus) {
      const status = await this.statusModel.findOne({ name: currentStatus });

      if (!status) {
        throw new NotFoundException(
          `The status ${currentStatus} does not exist`,
        );
      }

      aggregationPipeline.push({
        $lookup: {
          from: 'status',
          localField: 'character.currentStatus',
          foreignField: '_id',
          as: 'character.currentStatus',
        },
      });

      // Unwind 'character.currentStatus' array created by $lookup
      aggregationPipeline.push({
        $unwind: '$character.currentStatus',
      });

      // Match stage to filter by currentStatus
      aggregationPipeline.push({
        $match: {
          'character.currentStatus.name': currentStatus,
        },
      });
    }

    const totalCount = await this.performanceModel
      .aggregate([
        ...aggregationPipeline,
        {
          $count: 'count',
        },
      ])
      .exec();

    // Skip and Limit stages for pagination
    aggregationPipeline.push({
      $skip: skip,
    });
    aggregationPipeline.push({
      $limit: limit,
    });

    // Execute the aggregation
    const results = await this.performanceModel.aggregate(aggregationPipeline);

    if (results.length === 0) {
      throw new NotFoundException(`No results found`);
    }

    const count = totalCount.length > 0 ? totalCount[0].count : 0;
    const totalPages = Math.ceil(count / limit);

    const res: ResponseEntity = {
      info: {
        count,
        pages: totalPages,
        next:
          page < totalPages
            ? `${process.env.API_URL}/performances?page=${page + 1}`
            : null,
        prev:
          page > 1
            ? `${process.env.API_URL}/performances?page=${page - 1}`
            : null,
      },
      results,
    };

    return res;
  }
}

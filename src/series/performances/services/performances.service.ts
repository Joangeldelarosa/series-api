import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Performance } from 'src/series/entities/performance.entity';
import { CreatePerformanceDto } from '../dtos/create-performance.dto';
import { UpdatePerformanceDto } from '../dtos/update-performance.dto';
import {
  timeToSeconds,
  validateEpisodePerformances,
} from 'src/common/utils/time-tools';
import { Episode } from 'src/series/entities/episode.entity';
import { Character } from 'src/series/entities/character.entity';

@Injectable()
export class PerformancesService {
  constructor(
    @InjectModel('Performance') private performanceModel: Model<Performance>,
    @InjectModel('Episode') private episodeModel: Model<Episode>,
    @InjectModel('Character') private characterModel: Model<Character>,
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
}

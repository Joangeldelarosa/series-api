import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Episode } from 'src/series/entities/episode.entity';
import { Statuses } from 'src/series/entities/statuses.enum';

@Injectable()
export class UniqueEpisodeNamePipe implements PipeTransform {
  constructor(
    @InjectModel('Episode') private readonly episodeModel: Model<Episode>,
    @InjectModel('Status') private readonly statusModel: Model<Episode>,
  ) {}

  async transform(value: any): Promise<any> {
    const { name, season } = value;

    const activeStatus = await this.statusModel
      .findOne({ name: Statuses.Active })
      .exec();

    const episode = await this.episodeModel
      .findOne({ name, season, currentStatus: activeStatus._id })
      .exec();

    if (episode) {
      throw new BadRequestException(
        `Episode with name ${name} in the same season already exists`,
      );
    }

    return value;
  }
}

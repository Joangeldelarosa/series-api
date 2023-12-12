import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEpisodeDto } from '../dtos/create-episode.dto';
import { UpdateEpisodeDto } from '../dtos/update-episode.dto';
import { Episode } from 'src/series/entities/episode.entity';
import { Status } from 'src/series/entities/status.entity';
import { Statuses } from 'src/series/entities/statuses.enum';
import { Category } from 'src/series/entities/category.entity';
import { CategoryRelation } from 'src/series/entities/category-relation.entity';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CategoriesTypes } from 'src/series/entities/categories-types.enum';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectModel('Episode') private readonly episodeModel: Model<Episode>,
    @InjectModel('Status') private readonly statusModel: Model<Status>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('CategoryRelation')
    private readonly categoryRelationModel: Model<CategoryRelation>,
  ) {}

  // ANCHOR Create a episode
  async create(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    // find active status
    const activeStatus = await this.statusModel
      .findOne({ name: Statuses.Active })
      .exec();

    const createdEpisode = await this.episodeModel.create({
      ...createEpisodeDto,
      currentStatus: activeStatus._id,
    });
    // save and return populated fields
    return this.populateEpisode(createdEpisode);
  }

  // ANCHOR Update a episode
  async update(
    id: string,
    updateEpisodeDto: UpdateEpisodeDto,
  ): Promise<Episode> {
    // get active status
    const activeStatus = await this.statusModel
      .findOne({ name: Statuses.Active })
      .exec();

    // find episode with id and active status
    const episode = await this.episodeModel
      .findOneAndUpdate(
        { _id: id, currentStatus: activeStatus._id },
        updateEpisodeDto,
        { new: true },
      )
      .populate('season')
      .populate('currentStatus')
      .exec();

    if (!episode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }

    return episode;
  }

  // ANCHOR Remove a episode
  async remove(id: string): Promise<Episode> {
    // get active status
    const activeStatus = await this.statusModel
      .findOne({ name: Statuses.Active })
      .exec();

    // find episode with id and active status
    const episode = await this.episodeModel
      .findOneAndUpdate(
        { _id: id, currentStatus: activeStatus._id },
        {
          currentStatus: await this.statusModel.findOne({
            name: Statuses.Cancelled,
          }),
        },
        { new: true },
      )
      .populate('season')
      .populate('currentStatus')
      .exec();

    if (!episode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }

    return episode;
  }

  // ANCHOR Populate episode data
  private async populateEpisode(episode: Episode): Promise<Episode> {
    return this.episodeModel
      .findOne({ _id: episode._id })
      .populate('season')
      .populate('currentStatus')
      .exec();
  }

  // ANCHOR Get/Find episodes
  async findAll(
    page: number | string,
    season: string,
  ): Promise<ResponseEntity> {
    page = page ? (typeof page === 'string' ? parseInt(page) : page) : 1;
    page = page < 1 ? 1 : page;
    season = season ? season.toUpperCase() : null;

    const limit = 5;
    const query: any = {};

    // find status active
    const activeStatus = await this.statusModel
      .findOne({ name: Statuses.Active })
      .exec();

    if (!activeStatus) {
      throw new NotFoundException(`Status ${Statuses.Active} not found`);
    }

    // filter by active status
    query.currentStatus = activeStatus._id;

    if (season) {
      const seasonFound = await this.categoryModel.findOne({
        name: season,
      });

      if (seasonFound) {
        query.season = seasonFound._id;
      }
    }

    const results = await this.episodeModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('season')
      .populate('currentStatus')
      .exec();

    // if no results, return not found exception
    if (results.length === 0) {
      throw new NotFoundException(`No results found`);
    }

    const res: ResponseEntity = {
      info: {
        count: await this.episodeModel.countDocuments(query).exec(),
        pages: Math.ceil(
          (await this.episodeModel.countDocuments(query).exec()) / limit,
        ),
        next:
          page <
          Math.ceil((await this.episodeModel.countDocuments(query)) / limit)
            ? process.env.API_URL + `/episodes?page=${page + 1}`
            : null,
        prev:
          page > 1 ? process.env.API_URL + `/episodes?page=${page - 1}` : null,
      },

      results: await results,
    };

    return res;
  }

  // ANCHOR Get episodes seasons
  async getEpisodesSeasons(): Promise<string[]> {
    const results = await this.categoryRelationModel
      .findOne({
        category: CategoriesTypes.Seasons,
      })
      .populate('subcategories')
      .exec();

    return results.subcategories.map((sub) => sub.name);
  }
}

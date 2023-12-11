import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';

import { CategoriesTypes } from 'src/series/entities/categories-types.enum';
import { Category } from 'src/series/entities/category.entity';
import { Episode } from 'src/series/entities/episode.entity';
import { Character } from 'src/series/entities/character.entity';
import { Status } from 'src/series/entities/status.entity';
import { CategoryRelation } from 'src/series/entities/category-relation.entity';
import { StatusRelation } from 'src/series/entities/status-relation.entity';
import { Performance } from 'src/series/entities/performance.entity';
import { Statuses } from 'src/series/entities/statuses.enum';
import { StatusesTypes } from 'src/series/entities/statuses-types.enum';

const getSeason = (episode: string) => {
  const season = episode.substring(2, 3);
  return `SEASON ${season}`;
};

@Injectable()
export class MigrationService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
    @InjectModel('Episode')
    private readonly episodeModel: Model<Episode>,
    @InjectModel('Character')
    private readonly characterModel: Model<Character>,
    @InjectModel('Status')
    private readonly statusModel: Model<Status>,
    @InjectModel('CategoryRelation')
    private readonly categoryRelationModel: Model<CategoryRelation>,
    @InjectModel('StatusRelation')
    private readonly statusRelationModel: Model<StatusRelation>,
    @InjectModel('Performance')
    private readonly performanceModel: Model<Performance>,
  ) {}

  // ANCHOR: Run migration
  async runMigration(): Promise<void> {
    // ANCHOR: 1st. Delete all data from DB
    await this.categoryModel.deleteMany({});
    await this.episodeModel.deleteMany({});
    await this.characterModel.deleteMany({});
    await this.statusModel.deleteMany({});
    await this.categoryRelationModel.deleteMany({});
    await this.statusRelationModel.deleteMany({});
    await this.performanceModel.deleteMany({});
    console.log('Data deleted from DB');

    // ANCHOR: 2nd. Get data from API (Episodes and Characters)
    // Get episodes from API
    const episodes = await axios.get('https://rickandmortyapi.com/api/episode');

    while (episodes.data.info.next) {
      const nextEpisodes = await axios.get(episodes.data.info.next);
      episodes.data.results.push(...nextEpisodes.data.results);
      episodes.data.info = nextEpisodes.data.info;
    }

    // Get characters from API
    const characters = await axios.get(
      'https://rickandmortyapi.com/api/character',
    );

    while (characters.data.info.next) {
      const nextCharacters = await axios.get(characters.data.info.next);
      characters.data.results.push(...nextCharacters.data.results);
      characters.data.info = nextCharacters.data.info;
    }

    // Transform episodes data
    const episodesData: Episode[] = episodes.data.results.map(
      ({ characters, episode, ...rest }) => ({
        ...rest,
        season: getSeason(episode),
      }),
    );

    // Transform characters data
    const charactersData: Character[] = characters.data.results.map(
      ({ episode, species, ...rest }) => ({
        ...rest,
        specie: species.toUpperCase(),
      }),
    );

    console.log('Episodes and characters data transformed');

    // ANCHOR: 3rd. Process data and save it in DB
    const seasons = episodesData.map(({ season }) => season);
    // seasons.push('SEASON 3'); // Add SEASON 3 because it's not in the API
    const seasonsWithoutDuplicates = [...new Set(seasons)];

    const types = charactersData.map(({ specie }) => specie);
    const speciesWithoutDuplicates = [...new Set(types)];

    const categories = [
      ...seasonsWithoutDuplicates,
      ...speciesWithoutDuplicates,
    ];

    // ANCHOR: save categories in DB
    await this.categoryModel.insertMany(
      categories.map((category) => ({ name: category })),
    );
    console.log('Categories saved in DB');

    const speciesCategories = await this.categoryModel.find({
      name: { $in: speciesWithoutDuplicates },
    });

    const seasonsCategories = await this.categoryModel.find({
      name: { $in: seasonsWithoutDuplicates },
    });

    // ANCHOR: save categories relations in DB

    await this.categoryRelationModel.insertMany([
      {
        category: CategoriesTypes.Seasons,
        subcategories: seasonsCategories.map(({ _id }) => _id),
      },
      {
        category: CategoriesTypes.Species,
        subcategories: speciesCategories.map(({ _id }) => _id),
      },
    ]);
    console.log('Category relations saved in DB');

    // ANCHOR: save all statuses from enum in DB
    const statuses = Object.values(Statuses);

    await this.statusModel.insertMany(
      statuses.map((status) => ({ name: status })),
    );
    console.log('Statuses saved in DB');

    // save relations in DB for status.Characters and status.Episodes
    const activeStatus = await this.statusModel.findOne({
      name: Statuses.Active,
    });

    const suspendedStatus = await this.statusModel.findOne({
      name: Statuses.Suspended,
    });

    const cancelledStatus = await this.statusModel.findOne({
      name: Statuses.Cancelled,
    });

    // ANCHOR: save status relations in DB
    await this.statusRelationModel.insertMany([
      {
        type: StatusesTypes.Characters,
        statuses: [activeStatus._id, suspendedStatus._id],
      },
      {
        type: StatusesTypes.Episodes,
        statuses: [activeStatus._id, cancelledStatus._id],
      },
    ]);
    console.log('Status relations saved in DB');

    // ANCHOR: Save episodes in DB
    // Clean data, unique names for same season
    const episodesDataCleaned = episodesData.reduce((acc, episode) => {
      const episodeFound = acc.find(
        (ep) => ep.name === episode.name && ep.season === episode.season,
      );
      if (!episodeFound) {
        acc.push(episode);
      }
      return acc;
    }, []);

    for (const episode of episodesDataCleaned) {
      const newEpisode = new this.episodeModel(episode);
      newEpisode.currentStatus = activeStatus._id;
      const season = await this.categoryModel.findOne({
        name: episode.season,
      });
      newEpisode.season = season._id;
      await newEpisode.save();
    }

    console.log('Episodes saved in DB');

    // ANCHOR: Save characters in DB
    // Clean data, unique names for characters of same specie and type
    const charactersDataCleaned = charactersData.reduce((acc, character) => {
      const characterFound = acc.find(
        (char) =>
          char.name === character.name && char.specie === character.specie,
      );
      if (!characterFound) {
        acc.push(character);
      }
      return acc;
    }, []);

    for (const character of charactersDataCleaned) {
      const newCharacter = new this.characterModel(character);
      const specie = await this.categoryModel.findOne({
        name: character.specie,
      });
      newCharacter.specie = specie._id;
      newCharacter.currentStatus = activeStatus._id;
      await newCharacter.save();
    }

    console.log('Characters saved in DB');
  }
}

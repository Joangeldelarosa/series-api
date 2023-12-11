import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCharacterDto } from '../dtos/create-character.dto';
import { UpdateCharacterDto } from '../dtos/update-character.dto';
import { Character } from 'src/series/entities/character.entity';
import { Status } from 'src/series/entities/status.entity';
import { Statuses } from 'src/series/entities/statuses.enum';
import { Category } from 'src/series/entities/category.entity';
import { CategoryRelation } from 'src/series/entities/category-relation.entity';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CategoriesTypes } from 'src/series/entities/categories-types.enum';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel('Character') private readonly characterModel: Model<Character>,
    @InjectModel('Status') private readonly statusModel: Model<Status>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('CategoryRelation')
    private readonly categoryRelationModel: Model<CategoryRelation>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    // find active status
    const activeStatus = await this.statusModel
      .findOne({ name: Statuses.Active })
      .exec();

    const createdCharacter = await this.characterModel.create({
      ...createCharacterDto,
      currentStatus: activeStatus._id,
    });
    // save and return populated fields
    return this.populateCharacter(createdCharacter);
  }

  async update(
    id: string,
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    // get active status
    const activeStatus = await this.statusModel
      .findOne({ name: Statuses.Active })
      .exec();

    // find character with id and active status
    const character = await this.characterModel
      .findOneAndUpdate(
        { _id: id, currentStatus: activeStatus._id },
        updateCharacterDto,
        { new: true }, // Return the modified document
      )
      .populate('specie')
      .populate('currentStatus')
      .exec();

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return character;
  }

  async remove(id: string): Promise<void> {
    const suspendedStatus = await this.statusModel
      .findOne({ name: Statuses.Suspended })
      .exec();

    if (!suspendedStatus) {
      throw new NotFoundException(`Status ${Statuses.Suspended} not found`);
    }

    const character = await this.characterModel
      .findOneAndUpdate(
        { _id: id },
        { currentStatus: suspendedStatus._id },
        { new: true }, // Return the modified document
      )
      .exec();

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return;
  }

  private async populateCharacter(character: Character): Promise<Character> {
    return this.characterModel
      .findOne({ _id: character._id })
      .populate('specie')
      .populate('currentStatus')
      .exec();
  }

  async findAll(
    page: number | string,
    specie: string,
    type: string,
  ): Promise<ResponseEntity> {
    page = page ? (typeof page === 'string' ? parseInt(page) : page) : 1;
    page = page < 1 ? 1 : page;
    specie = specie ? specie.toUpperCase() : null;
    type = type ? type.toUpperCase() : null;

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

    if (specie) {
      const specieFound = await this.categoryModel.findOne({
        name: specie,
      });

      if (specieFound) {
        query.specie = specieFound._id;
      }
    }

    if (type) {
      query.type = type;
    }

    const results = await this.characterModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('specie')
      .populate('currentStatus')
      .exec();

    // if no results, return not found exception
    if (results.length === 0) {
      throw new NotFoundException(`No results found`);
    }

    const res: ResponseEntity = {
      info: {
        count: await this.characterModel.countDocuments(query).exec(),
        pages: Math.ceil(
          (await this.characterModel.countDocuments(query).exec()) / limit,
        ),
        next:
          page <
          Math.ceil((await this.characterModel.countDocuments(query)) / limit)
            ? process.env.API_URL + `/characters?page=${page + 1}`
            : null,
        prev:
          page > 1
            ? process.env.API_URL + `/characters?page=${page - 1}`
            : null, // Ajustado aquí
      },

      results: await results,
    };

    return res;
  }

  // get array of string of characters types (not repeated)
  async getCharactersTypes(): Promise<string[]> {
    const results = await this.characterModel.distinct('type').exec();
    return results;
  }

  // get array of string of characters species from categoryrelations where category is CategoryType.Species
  async getCharactersSpecies(): Promise<string[]> {
    const results = await this.categoryRelationModel
      .findOne({
        category: CategoriesTypes.Species,
      })
      .populate('subcategories')
      .exec();

    return results.subcategories.map((sub) => sub.name);
  }
}

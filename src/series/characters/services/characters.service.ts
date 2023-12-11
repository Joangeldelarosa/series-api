import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCharacterDto } from '../dtos/create-character.dto';
import { UpdateCharacterDto } from '../dtos/update-character.dto';
import { Character } from 'src/series/entities/character.entity';
import { Status } from 'src/series/entities/status.entity';
import { Statuses } from 'src/series/entities/statuses.enum';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel('Character') private readonly characterModel: Model<Character>,
    @InjectModel('Status') private readonly statusModel: Model<Status>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const createdCharacter = await this.characterModel.create(
      createCharacterDto,
    );
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
}

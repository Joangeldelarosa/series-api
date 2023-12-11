import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
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
    const createdCharacter = new this.characterModel(createCharacterDto);
    return createdCharacter.save();
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
      .findOne({ _id: id, currentStatus: activeStatus._id })
      .exec();

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    character.set(updateCharacterDto);
    await character.save();

    return character;
  }

  async remove(id: string): Promise<void> {
    const suspendedStatus = await this.statusModel
      .findOne({ name: Statuses.Suspended })
      .exec();

    if (!suspendedStatus) {
      throw new NotFoundException(`Status ${Statuses.Suspended} not found`);
    }

    const character = await this.characterModel.findOne({ _id: id }).exec();

    if (character) {
      character.currentStatus = suspendedStatus._id;
      await character.save();
    } else {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
  }
}

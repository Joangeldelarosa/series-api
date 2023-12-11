import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from 'src/series/entities/character.entity';
import { Statuses } from 'src/series/entities/statuses.enum';

@Injectable()
export class UniqueCharacterNamePipe implements PipeTransform {
  constructor(
    @InjectModel('Character') private readonly characterModel: Model<Character>,
    @InjectModel('Status') private readonly statusModel: Model<Character>,
  ) {}

  async transform(value: any): Promise<any> {
    value.type = value.type ? value.type.toUpperCase() : undefined;
    const { name, specie, type } = value;

    const activeStatus = await this.statusModel
      .findOne({ name: Statuses.Active })
      .exec();

    const character = await this.characterModel
      .findOne({ name, specie, type, currentStatus: activeStatus._id })
      .exec();

    if (character) {
      throw new BadRequestException(
        `Character with name ${name} using same specie and type already exists`,
      );
    }

    return value;
  }
}

import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CategoriesService } from 'src/series/services/categories.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from 'src/series/entities/character.entity';

@Injectable()
export class UniqueNamePipe implements PipeTransform {
  constructor(
    private readonly categoriesService: CategoriesService,
    @InjectModel('Character') private readonly characterModel: Model<Character>,
  ) {}

  async transform(value: any): Promise<any> {
    const { name, specie, type } = value;

    console.log('value', value);

    return value;
  }
}

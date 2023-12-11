// valid-category.pipe.ts
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CategoriesService } from 'src/series/services/categories.service';
import { CategoriesTypes } from 'src/series/entities/categories-types.enum';

@Injectable()
export class ValidCategoryPipe implements PipeTransform {
  constructor(private readonly categoriesService: CategoriesService) {}

  async transform(value: any): Promise<any> {
    const { specie, season } = value;

    const specieCheck = specie
      ? await this.validateCategory(specie, CategoriesTypes.Species, value)
      : true;
    const seasonCheck = season
      ? await this.validateCategory(season, CategoriesTypes.Seasons, value)
      : true;

    if (!specieCheck || !seasonCheck) {
      throw new BadRequestException('Invalid category');
    }

    return value;
  }

  private async validateCategory(
    value: string,
    type: CategoriesTypes,
    request: any,
  ): Promise<boolean> {
    const category = await this.categoriesService.findCategoryByName(value);

    if (!category) {
      throw new BadRequestException(
        `${type === CategoriesTypes.Species ? 'Specie' : 'Season'} not found`,
      );
    }

    const allowed = await this.categoriesService.isCategoryAllowedFor(
      value,
      type,
    );

    if (!allowed) {
      throw new BadRequestException(
        `${type === CategoriesTypes.Species ? 'Specie' : 'Season'} not allowed`,
      );
    }

    request[type === CategoriesTypes.Species ? 'specie' : 'season'] =
      category._id;
    return true;
  }
}

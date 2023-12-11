// categories.service.ts
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/series/entities/category.entity'; // Ajusta la ruta según tu estructura de archivos
import { CategoryRelation } from '../entities/category-relation.entity';
import { CategoriesTypes } from '../entities/categories-types.enum';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('CategoryRelation')
    private readonly categoriesRelationModel: Model<CategoryRelation>,
  ) {}

  // ANCHOR: Find category by name
  async findCategoryByName(name: string): Promise<Category | null> {
    return this.categoryModel.findOne({ name }).exec();
  }

  // ANCHOR: Check if specie is allowed for category type by subcategory name
  async isCategoryAllowedFor(
    value: string,
    type: CategoriesTypes,
  ): Promise<boolean> {
    const specieCategoryRelation = await this.categoriesRelationModel
      .findOne({
        category: type,
      })
      .populate('subcategories')
      .exec();

    // check if value is in subcategories.name
    const allowed = specieCategoryRelation.subcategories.some(
      (subcat) => subcat.name === value,
    );

    if (!allowed) {
      return false;
    }

    return true;
  }
}

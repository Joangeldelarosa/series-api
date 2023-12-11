import { Module } from '@nestjs/common';
import { CharactersService } from './services/characters.service';
import { CharactersController } from './controllers/characters.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { CharacterSchema } from '../schemas/character.schema';
import { StatusSchema } from '../schemas/status.schema';
import { CategoriesService } from '../services/categories.service';
import { CategoryRelationSchema } from '../schemas/category-relation.schema';
import { CategorySchema } from '../schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Character', schema: CharacterSchema },
      { name: 'Status', schema: StatusSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'CategoryRelation', schema: CategoryRelationSchema },
    ]),
  ],
  providers: [CharactersService, CategoriesService],
  controllers: [CharactersController],
})
export class CharactersModule {}

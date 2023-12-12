import { Module } from '@nestjs/common';
import { CharactersModule } from './characters/characters.module';
import { CategoriesService } from './services/categories.service';

import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schemas/category.schema';
import { CategoryRelationSchema } from './schemas/category-relation.schema';
import { EpisodesModule } from './episodes/episodes.module';
import { PerformancesModule } from './performances/performances.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'CategoryRelation', schema: CategoryRelationSchema },
    ]),
    CharactersModule,
    EpisodesModule,
    PerformancesModule,
  ],
  providers: [CategoriesService],
})
export class SeriesModule {}

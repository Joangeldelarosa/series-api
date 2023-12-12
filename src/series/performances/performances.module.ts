import { Module } from '@nestjs/common';
import { PerformancesService } from './services/performances.service';
import { PerformancesController } from './controllers/performances.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from '../services/categories.service';
import { PerformanceSchema } from '../schemas/performance.schema';
import { CharacterSchema } from '../schemas/character.schema';
import { EpisodeSchema } from '../schemas/episode.schema';
import { CategorySchema } from '../schemas/category.schema';
import { CategoryRelationSchema } from '../schemas/category-relation.schema';
import { StatusSchema } from '../schemas/status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Performance', schema: PerformanceSchema },
      { name: 'Character', schema: CharacterSchema },
      { name: 'Episode', schema: EpisodeSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'CategoryRelation', schema: CategoryRelationSchema },
      { name: 'Status', schema: StatusSchema },
    ]),
  ],
  providers: [PerformancesService, CategoriesService],
  controllers: [PerformancesController],
})
export class PerformancesModule {}

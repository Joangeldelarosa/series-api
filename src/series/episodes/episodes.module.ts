import { Module } from '@nestjs/common';
import { EpisodesService } from './services/episodes.service';
import { EpisodesController } from './controllers/episodes.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { StatusSchema } from '../schemas/status.schema';
import { CategoriesService } from '../services/categories.service';
import { CategoryRelationSchema } from '../schemas/category-relation.schema';
import { CategorySchema } from '../schemas/category.schema';
import { EpisodeSchema } from '../schemas/episode.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Episode', schema: EpisodeSchema },
      { name: 'Status', schema: StatusSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'CategoryRelation', schema: CategoryRelationSchema },
    ]),
  ],
  providers: [EpisodesService, CategoriesService],
  controllers: [EpisodesController],
})
export class EpisodesModule {}

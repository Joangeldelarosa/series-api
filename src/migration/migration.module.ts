import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigrationService } from './migration.service';

import { CategorySchema } from 'src/series/schemas/category.schema';
import { CategoryRelationSchema } from 'src/series/schemas/category-relation.schema';
import { EpisodeSchema } from 'src/series/schemas/episode.schema';
import { PerformanceSchema } from 'src/series/schemas/performance.schema';
import { CharacterSchema } from 'src/series/schemas/character.schema';
import { StatusSchema } from 'src/series/schemas/status.schema';
import { StatusRelationSchema } from 'src/series/schemas/status-relation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    MongooseModule.forFeature([
      { name: 'CategoryRelation', schema: CategoryRelationSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Episode', schema: EpisodeSchema }]),
    MongooseModule.forFeature([
      { name: 'Performance', schema: PerformanceSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Character', schema: CharacterSchema }]),
    MongooseModule.forFeature([{ name: 'Status', schema: StatusSchema }]),
    MongooseModule.forFeature([
      { name: 'StatusRelation', schema: StatusRelationSchema },
    ]),
  ],
  providers: [MigrationService],
})
export class MigrationModule {}

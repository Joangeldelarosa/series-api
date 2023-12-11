import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigrationService } from './migration.service';

import { CategorySchema } from 'src/serie/schemas/category.schema';
import { CategoryRelationSchema } from 'src/serie/schemas/category-relation.schema';
import { EpisodeSchema } from 'src/serie/schemas/episode.schema';
import { PerformanceSchema } from 'src/serie/schemas/performance.schema';
import { CharacterSchema } from 'src/serie/schemas/character.schema';
import { StatusSchema } from 'src/serie/schemas/status.schema';
import { StatusRelationSchema } from 'src/serie/schemas/status-relation.schema';

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

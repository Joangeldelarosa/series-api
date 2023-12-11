import { Module } from '@nestjs/common';
import { CharactersService } from './services/characters.service';
import { CharactersController } from './controllers/characters.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { CharacterSchema } from '../schemas/character.schema';
import { StatusSchema } from '../schemas/status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Character', schema: CharacterSchema },
      { name: 'Status', schema: StatusSchema },
    ]),
  ],
  providers: [CharactersService],
  controllers: [CharactersController],
})
export class CharactersModule {}

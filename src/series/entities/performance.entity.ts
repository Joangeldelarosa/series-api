import * as mongoose from 'mongoose';
import { Episode } from './episode.entity';
import { Character } from './character.entity';

export interface Performance {
  _id?: mongoose.Types.ObjectId;
  interval: { start: string; end: string };
  episode: mongoose.Types.ObjectId | Episode;
  character: mongoose.Types.ObjectId | Character;
}

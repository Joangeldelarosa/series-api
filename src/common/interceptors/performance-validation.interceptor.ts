import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Performance } from 'src/series/entities/performance.entity';
import { validateNewInterval } from '../utils/time-tools';
import { Episode } from 'src/series/entities/episode.entity';
import { Character } from 'src/series/entities/character.entity';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceValidationInterceptor implements NestInterceptor {
  constructor(
    @InjectModel('Performance') private performanceModel: Model<Performance>,
    @InjectModel('Episode') private episodeModel: Model<Episode>,
    @InjectModel('Character') private characterModel: Model<Character>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { body, params } = request;

    let { episodeId, characterId } = body;
    const { interval } = body;

    if (interval) {
      const start = interval.start.split(':');
      const end = interval.end.split(':');

      if (
        start.length !== 2 ||
        end.length !== 2 ||
        Number(start[0]) > 60 ||
        Number(start[1]) > 59 ||
        Number(end[0]) > 60 ||
        Number(end[1]) > 59 ||
        Number(start[0]) > Number(end[0]) ||
        (Number(start[0]) === Number(end[0]) &&
          Number(start[1]) >= Number(end[1]))
      ) {
        throw new BadRequestException('Invalid interval.');
      }

      // Si episodeId y characterId no se proporcionan, buscarlos a partir de params.id
      if (!episodeId || !characterId) {
        const performance = await this.performanceModel.findById(params.id);
        if (performance) {
          episodeId = episodeId || performance.episode._id.toString();
          characterId = characterId || performance.character._id.toString();
        } else {
          throw new BadRequestException('Performance not found.');
        }
      }

      // Verificar si el episodio y el personaje existen
      const episode = await this.episodeModel.findById(episodeId);
      const character = await this.characterModel.findById(characterId);

      if (!episode || !character) {
        throw new BadRequestException('Episode or character not found.');
      }

      // Obtener todos los rendimientos relacionados con el episodio y el personaje
      const performances: any = await this.performanceModel
        .find({ episode: episodeId, character: characterId })
        .sort({ 'interval.start': 1 }); // Ordenar por inicio para facilitar la validación

      // eliminar de performances el rendimiento que se está editando
      if (params.id) {
        performances.forEach((performance, index) => {
          if (performance._id.toString() === params.id) {
            performances.splice(index, 1);
          }
        });
      }

      // Verificar si el intervalo propuesto es válido
      if (!validateNewInterval(performances, characterId, interval)) {
        throw new BadRequestException('Invalid interval for the character.');
      }
    }

    return next.handle().pipe(
      tap(() => {
        // Lógica adicional después de que se maneje la solicitud (opcional)
      }),
    );
  }
}

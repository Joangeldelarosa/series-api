import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Statuses } from 'src/series/entities/statuses.enum';

@Injectable()
export class StatusValidatePipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (metadata.data === 'currentStatus' && value) {
      value = value.toUpperCase();
      if (!this.isStatusValid(value.toUpperCase())) {
        throw new BadRequestException(`${value} is an invalid status`);
      }
    }
    return value;
  }

  private isStatusValid(status: any): boolean {
    const enumValues = Object.values(Statuses);
    return enumValues.includes(status);
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        const page = +request.query.page || 1;

        if (!data || !data.results || data.results.length === 0) {
          throw new NotFoundException('No results found');
        }

        const paginatedData = {
          info: {
            count: data.results.length,
            pages: data.info.pages,
            next:
              page < data.info.pages
                ? `${request.originalUrl}?page=${page + 1}`
                : null,
            prev: page > 1 ? `${request.originalUrl}?page=${page - 1}` : null,
          },
          results: data.results,
        };

        return paginatedData;
      }),
    );
  }
}

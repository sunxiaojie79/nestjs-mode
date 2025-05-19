import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp().getRequest();
    console.log('before', ctx);
    return next.handle().pipe(
      map((data) => {
        console.log('after', data);
        return {
          data,
        };
      }),
    );
  }
}

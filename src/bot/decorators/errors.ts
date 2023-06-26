import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        // if (err instanceof BaseError) {
        //   return throwError(() => err);
        // }

        console.log('ErrorsInterceptor', err);
        return throwError(() => new BadGatewayException());
      }),
    );
  }
}

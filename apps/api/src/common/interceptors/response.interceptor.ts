import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

export interface ResponseFormat<T = any> {
  isSuccess: boolean;
  message: string;
  data?: T;
  meta?: Record<string, any>;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((res: any) => ({
        isSuccess: true,
        message: "Request successful",
        data: res?.data ?? res,
        meta: res?.meta,
      }))
    );
  }
}

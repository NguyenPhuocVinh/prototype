import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import moment from 'moment';
import { map, Observable } from 'rxjs';
import { appSettings } from 'src/configs/app.config';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const status = context.switchToHttp().getResponse().statusCode;
        const request = context.switchToHttp().getRequest<Request>();
        return next.handle().pipe(
            map((data) => {
                const result = {
                    statusCode: status,
                    timestamp: moment().tz(appSettings.timezone).toDate(),
                    path: request.url,
                    ...data,
                };

                return result;
            }),
        );
    }
}

import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CommonService } from '../services/common.service';
import { Observable, from, switchMap } from 'rxjs';
import {
    CHECK_VALID_DATA,
    CheckValidDataDecoratorOptions,
} from '../decorators/check-valid-data.decorator';
import _ from 'lodash';

@Injectable()
export class CheckDataValidInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly commonService: CommonService,
    ) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const CheckExitDataDecoratorOptions: CheckValidDataDecoratorOptions =
            this.reflector.get<CheckValidDataDecoratorOptions>(
                CHECK_VALID_DATA,
                context.getHandler(),
            );

        if (!CheckExitDataDecoratorOptions) {
            return next.handle();
        }

        const { collectionName } = CheckExitDataDecoratorOptions;

        const req = context.switchToHttp().getRequest();

        const { body } = req;
        const data = _.get(body, 'name', null);
        return from(
            this.commonService.checkValidCollection({
                collectionName,
                data,
            }),
        ).pipe(switchMap(() => next.handle()));
    }
}

import {
    CallHandler,
    ExecutionContext,
    Inject,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidatorService } from '../__validator__/validator.service';
import { from, Observable, switchMap } from 'rxjs';
import {
    VALIDATOR_BODY_DATA,
    ValidatorBodyDecoratorOptions,
} from '../decorators/validator-body.decorator';
import _ from 'lodash';

export class ValidatorBodyInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly validatorService: ValidatorService,
    ) {
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const options: ValidatorBodyDecoratorOptions =
            this.reflector.get<ValidatorBodyDecoratorOptions>(
                VALIDATOR_BODY_DATA,
                context.getHandler(),
            );

        if (!options) return next.handle();

        const request = context.switchToHttp().getRequest();
        const { body, params, method } = request;

        const collectionName =
            options.collectionName || _.get(params, 'entity');

        const url = _.get(params, 'entity');

        return from(
            this.validatorService.validateBody({
                collectionName,
                method,
                url,
                body,
                options: options.options,
            }),
        ).pipe(switchMap(() => next.handle()));
    }
}

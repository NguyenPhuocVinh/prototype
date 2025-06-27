import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import _ from 'lodash';
import { appSettings } from 'src/configs/app.config';
import { AUDIT_LOG, AUDIT_LOG_DATA, AuditDecoratorOptions } from '../decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/cores/event-handler/constants';
const { appUrl } = appSettings;
@Injectable()
export class AuditsInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const audit: AuditDecoratorOptions =
            this.reflector.get<AuditDecoratorOptions>(
                AUDIT_LOG_DATA,
                context.getHandler(),
            );

        if (!audit) {
            return next.handle();
        }

        const { event, targetType } = audit;
        const req = context.switchToHttp().getRequest();

        try {
            const { user, originalUrl } = req;

            const ip =
                req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'] || '';

            const auditData = {
                event,
                url: (appUrl ? appUrl : req.get('host') + '://') + originalUrl,
                targetType: targetType,
                ipAddress: ip,
                userAgent: userAgent,
                createdBy: user,
                oldvalues: {},
                newValues: {},
                targetId: '',
                locale: '',
            };

            return next.handle().pipe(
                tap((response) => {
                    const data = response?.data ? response?.data : response;

                    if (
                        event === AUDIT_EVENT.CREATED ||
                        event === AUDIT_EVENT.UPLOAD_FILE_FRONT
                    ) {
                        auditData['oldValues'] = {};
                        auditData['newValues'] = data;
                        auditData['targetId'] = data['id'];
                        this.eventEmitter.emit(AUDIT_LOG, auditData);
                    }

                    if (event === AUDIT_EVENT.UPDATED) {
                        auditData['oldValues'] = {};
                        auditData['newValues'] = data;
                        auditData['targetVd'] = data['id'];
                        auditData['locale'] = data['locale'];
                        this.eventEmitter.emit(AUDIT_LOG, auditData);
                    }

                    if (event === AUDIT_EVENT.DELETED) {
                        if (_.isArray(data)) {
                            for (const item of data) {
                                auditData['oldValues'] = item;
                                auditData['newValues'] = {};
                                auditData['target_id'] = item['id'];
                                this.eventEmitter.emit(AUDIT_LOG, auditData);
                            }
                        } else {
                            auditData['oldValues'] = data;
                            auditData['newValues'] = {};
                            auditData['targetId'] = data['id'];
                            this.eventEmitter.emit(AUDIT_LOG, auditData);
                        }
                    }
                }),
            );
        } catch (error) {
            return next.handle();
        }
    }
}

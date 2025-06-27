import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_DATA = 'AUDIT_LOG_DATA';
export const AUDIT_LOG = 'audit-log';

export interface AuditDecoratorOptions {
    event: string;
    targetType: string;
}

export const AuditDecorator = (option: AuditDecoratorOptions) =>
    SetMetadata(AUDIT_LOG_DATA, option);

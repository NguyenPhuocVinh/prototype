import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditsService } from 'src/apis/audits/audits.service';
import { Audit } from 'src/apis/audits/entities/audit.entity';
import { AUDIT_LOG } from 'src/cores/decorators/audits.decorator';

@Injectable()
export class AuditLogEvent {
    private readonly logger = new Logger(AuditLogEvent.name);
    constructor(private auditsService: AuditsService) { }

    @OnEvent(AUDIT_LOG)
    async handleSendMailEvent(event: Audit) {
        this.logger.debug(`Created event...`);
        await this.auditsService.create(event);
        this.logger.debug(`Created event...done`);
    }
}

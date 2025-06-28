import { Module } from '@nestjs/common';
import { AuditsController } from './audits.controller';
import { AuditsService } from './audits.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { AuditSchema } from './entities/audit.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditsInterceptor } from 'src/cores/interceptors/audits.interceptor';
import { AuditLogEvent } from 'src/cores/event-handler/audits/audit-logs.event';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION_NAME.AUDIT,
        schema: AuditSchema
      }
    ])
  ],
  controllers: [AuditsController],
  providers: [
    AuditsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditsInterceptor,
    },
    AuditLogEvent,
  ]
})
export class AuditsModule { }

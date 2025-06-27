import { Module } from '@nestjs/common';
import { AuditsController } from './audits.controller';
import { AuditsService } from './audits.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { AuditSchema } from './entities/audit.entity';

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
  providers: [AuditsService]
})
export class AuditsModule { }

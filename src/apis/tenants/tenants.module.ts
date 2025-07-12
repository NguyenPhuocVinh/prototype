import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { TenantSchema } from './entities/tenant.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION_NAME.TENANT,
        schema: TenantSchema
      }
    ])
  ],
  providers: [TenantsService],
  controllers: [TenantsController]
})
export class TenantsModule { }

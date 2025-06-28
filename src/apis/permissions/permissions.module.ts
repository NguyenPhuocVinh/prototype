import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { PermissionSchema } from './entities/permission.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION_NAME.PERMISSION,
        schema: PermissionSchema
      }
    ])
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule { }

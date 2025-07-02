import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { DriverIdentitySchema } from './entities/driver-identity.entity';
import { DriverSchema } from './entities/driver.entity';
import { DriverReivewSchema } from './entities/driver-review.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION_NAME.DRIVER_IDENTITY,
        schema: DriverIdentitySchema
      },
      {
        name: COLLECTION_NAME.DRIVER,
        schema: DriverSchema
      },
      {
        name: COLLECTION_NAME.DRIVER_REVIEW,
        schema: DriverReivewSchema
      }
    ])
  ],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService]
})
export class DriversModule { }

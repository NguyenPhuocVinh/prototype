import { Module } from '@nestjs/common';
import { ValidatesController } from './validates.controller';
import { ValidatesService } from './validates.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { ValidateSchema } from './entities/validate.entity';
import { ModelsModule } from '../models/models.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: COLLECTION_NAME.VALIDATE,
          schema: ValidateSchema
        }
      ]
    ),
    ModelsModule
  ],
  controllers: [ValidatesController],
  providers: [ValidatesService],
  exports: [ValidatesService]
})
export class ValidatesModule { }

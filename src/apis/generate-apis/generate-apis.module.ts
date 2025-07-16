import { Module } from '@nestjs/common';
import { GenerateApisController } from './generate-apis.controller';
import { GenerateApisService } from './generate-apis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { GenerateApisSchema } from './entities/generate-apis.entity';
import { ModelsModule } from '../models/models.module';
import { ValidatesModule } from '../validates/validates.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION_NAME.GENERATE_APIS,
        schema: GenerateApisSchema
      }
    ]),
    ModelsModule,
    ValidatesModule
  ],
  controllers: [GenerateApisController],
  providers: [GenerateApisService]
})
export class GenerateApisModule { }

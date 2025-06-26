import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { StoreSchema } from './entities/store.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION_NAME.STORE,
        schema: StoreSchema
      }
    ])
  ],
  controllers: [StoresController],
  providers: [StoresService]
})
export class StoresModule { }

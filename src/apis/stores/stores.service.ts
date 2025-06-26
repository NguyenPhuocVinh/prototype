import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { Store } from './entities/store.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { Connection, Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StoresService extends BaseService<Store> {
    constructor(
        @InjectConnection()
        public readonly connection: Connection,
        eventEmitter: EventEmitter2,
        @InjectModel(COLLECTION_NAME.STORE)
        private readonly storeModel: Model<Store>,

    ) {
        super(
            connection,
            storeModel,
            eventEmitter,
            COLLECTION_NAME.STORE
        );
    }

}

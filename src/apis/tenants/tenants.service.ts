import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { Tenant } from './entities/tenant.entity';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TenantsService extends BaseService<Tenant> {
    collection: string = COLLECTION_NAME.TENANT;
    baseRepositoryService: BaseRepositoryService<Tenant>;
    private readonly logger = new Logger(TenantsService.name);

    constructor(
        @InjectConnection()
        public readonly connection: Connection,
        @InjectModel(COLLECTION_NAME.TENANT)
        private readonly tenantModel: Model<Tenant>,
        eventEmitter: EventEmitter2
    ) {
        super(connection, tenantModel, eventEmitter, COLLECTION_NAME.TENANT);
        this.baseRepositoryService = new BaseRepositoryService(
            tenantModel,
            COLLECTION_NAME.TENANT,
            eventEmitter
        );
    }
}

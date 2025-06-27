import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { Permissions } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { mongooseTransactionHandler } from 'src/common/func-helper/mongoose-transaction';

@Injectable()
export class PermissionsService {
    baseRepositoryService: BaseRepositoryService<Permissions>;
    collection: string = COLLECTION_NAME.PERMISSION;
    private readonly logger = new Logger(PermissionsService.name);
    constructor(
        @InjectConnection() public readonly connection: Connection,
        @InjectModel(COLLECTION_NAME.PERMISSION)
        private readonly permissionModel: Model<Permissions>,
        eventEmitter: EventEmitter2,
    ) {
        this.baseRepositoryService = new BaseRepositoryService(
            permissionModel,
            this.collection,
            eventEmitter,
        );
    }

    async create(
        createPermissionDto: CreatePermissionDto
    ): Promise<any> {
        const { name, entityName } = createPermissionDto;
        const session = await this.connection.startSession();

        const permissionParams = [
            'admin.###.index',
            'admin.###.create',
            'admin.###.edit',
            'admin.###.destroy',
        ];

        const resultArray = permissionParams.map((item) => ({
            name: item.replace('###', name),
            entityName,
        }));

        const transactionHandlerMethod = async () => {
            return await this.permissionModel.insertMany(resultArray);
        };

        const permissions = await mongooseTransactionHandler(
            transactionHandlerMethod,
            (error) => {
                throw new UnprocessableEntityException(error);
            },
            this.connection,
            session,
        );

        return permissions;
    }
}

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { Role } from './entities/role.entity';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PermissionsService } from '../permissions/permissions.service';
import { RulesService } from '../rules/rules.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import { removeDiacritics } from 'src/common/func-helper/conver-value';
import _ from 'lodash';
import { RULE_PERMISSION } from 'src/common/contants/enum';
import { mongooseTransactionHandler } from 'src/common/func-helper/mongoose-transaction';

@Injectable()
export class RolesService extends BaseService<Role> {
    baseRepositoryService: BaseRepositoryService<Role>;
    collection: string = COLLECTION_NAME.ROLE;
    constructor(
        @InjectConnection() public connection: Connection,
        @InjectModel(COLLECTION_NAME.ROLE) private roleModel: Model<Role>,
        public readonly eventEmitter: EventEmitter2,
        private readonly permissionService: PermissionsService,
        private readonly ruleService: RulesService,
        // private readonly cacheMangerService: CacheMangerService,
    ) {
        super(connection, roleModel, eventEmitter, COLLECTION_NAME.ROLE);

        this.baseRepositoryService = new BaseRepositoryService(
            roleModel,
            this.collection,
            eventEmitter,
        );
    }

    async create(
        createRoleDto: CreateRoleDto,
        createdBy: CreatedBy,
    ): Promise<{ data: Role }> {
        const session = await this.connection.startSession();

        const { name, permissions, rules } = createRoleDto;
        const slug = _.kebabCase(removeDiacritics(name));

        const role = await this.roleModel.findOne({
            name,
        });

        if (role) {
            throw new UnprocessableEntityException(
                'role_already_exists',
                'Role already exists',
            );
        }

        const permissionIds = await this.permissionService.findPermissionIds(
            permissions,
        );

        const rulePermissionIds = await this.ruleService.findRuleIds(
            rules,
        )

        const result = new this.roleModel({
            ...createRoleDto,
            slug,
            createdBy,
            permissions: permissionIds,
            rules: rulePermissionIds,
        });

        const transactionHandlerMethod = async () => {
            await this.baseRepositoryService.save(result, { session });
        };

        await mongooseTransactionHandler<void>(
            transactionHandlerMethod,
            (error) => {
                throw new UnprocessableEntityException(error);
            },
            this.connection,
            session,
        );

        return {
            data: result,
        };
    }

    async findRoleBySlug(
        id: string,
    ): Promise<Role> {
        const filterQuery: any = {
            $and: [
                {
                    slug: id,
                },
                {
                    isActive: true,
                }
            ]
        }

        const role = await this.roleModel
            .findOne(filterQuery)
            .lean()

        if (!role) {
            throw new UnprocessableEntityException(
                'role_not_found',
                'Role not found',
            );
        }

        return role;
    }
}

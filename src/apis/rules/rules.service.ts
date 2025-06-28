import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { Rule } from './entities/rule.entity';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateRuleDto } from './dto/create-rule.dto';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import _ from 'lodash';
import { removeDiacritics } from 'src/common/func-helper/conver-value';
import { mongooseTransactionHandler } from 'src/common/func-helper/mongoose-transaction';

@Injectable()
export class RulesService extends BaseService<Rule> {
    baseRepositoryService: BaseRepositoryService<Rule>;
    collection: string = COLLECTION_NAME.RULE;
    constructor(
        @InjectConnection() public readonly connection: Connection,
        @InjectModel(COLLECTION_NAME.RULE)
        private readonly ruleModel: Model<Rule>,
        eventEmitter: EventEmitter2,
    ) {
        super(connection, ruleModel, eventEmitter, COLLECTION_NAME.RULE);
        this.baseRepositoryService = new BaseRepositoryService(
            ruleModel,
            this.collection,
            eventEmitter,
        );
    }

    async create(
        createRuleDto: CreateRuleDto,
        createdBy: CreatedBy,
    ): Promise<{ data: Rule }> {
        const session = await this.connection.startSession();

        const { name } = createRuleDto;
        const slug = _.kebabCase(removeDiacritics(name));
        const result = new this.ruleModel({
            ...createRuleDto,
            slug,
            createdBy,
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

    async findRuleIds(ids: string[]): Promise<Types.ObjectId[]> {
        if (!ids || ids.length === 0) {
            return [];
        }

        const rules = await this.ruleModel.find({
            _id: { $in: ids },
        });

        if (rules.length !== ids.length) {
            throw new UnprocessableEntityException(
                'rule_not_found',
                'Some rules not found',
            );
        }

        return rules.map((rule) => rule._id as Types.ObjectId);
    }
}

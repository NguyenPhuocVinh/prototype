import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Validates } from './entities/validate.entity';
import { BaseService } from 'src/cores/base-service/base.service';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import _ from 'lodash';
import { removeDiacritics } from 'src/common/func-helper/conver-value';
import { mongooseTransactionHandler } from 'src/common/func-helper/mongoose-transaction';
import { replacePlaceholders } from 'src/common/func-helper/replace-placeholders';
import { ModelsService } from '../models/models.service';

@Injectable()
export class ValidatesService extends BaseService<Validates> {
    baseRepositoryService: BaseRepositoryService<Validates>;
    collection: string = COLLECTION_NAME.VALIDATE;
    private readonly logger = new Logger(ValidatesService.name);

    constructor(
        @InjectConnection()
        public readonly connection: Connection,
        @InjectModel(COLLECTION_NAME.VALIDATE)
        private readonly validateModel: Model<Validates>,
        private readonly modelsService: ModelsService,
        eventEmitter: EventEmitter2
    ) {
        super(connection, validateModel, eventEmitter, COLLECTION_NAME.VALIDATE);
        this.baseRepositoryService = new BaseRepositoryService(
            validateModel,
            this.collection,
            eventEmitter
        )
    }

    async create(
        payload: any,
        user?: CreatedBy,
        id?: string
    ): Promise<{ data: Validates; } | any> {
        const session = await this.connection.startSession();

        let slug = _.get(payload, 'slug', null);
        if (!slug) {
            const name = _.get(payload, 'name', null);
            slug = _.kebabCase(removeDiacritics(name));
        }

        const result = await mongooseTransactionHandler(
            async () => {
                const data = new this.validateModel({
                    ...payload,
                    slug,
                    entity: new Types.ObjectId(payload.entity),
                    generateApi: new Types.ObjectId(payload.generateApi),
                    createdBy: user,
                })
                return this.baseRepositoryService.save(data, { session });
            },
            (error) => {
                throw new Error(`Error creating Generate API: ${error.message}`);
            },
            this.connection,
            session
        );

        return { data: result };
    }

    async checkValidations(entityId: Types.ObjectId, collectionName: string, payload: any) {
        const validators = await this.validateModel.find({
            entity: entityId,
            collectionName,
        });

        for (const validator of validators) {
            const model = await this.modelsService.getModel(collectionName);

            if (validator.pipeline && validator.pipeline.length > 0) {
                let pipeline = JSON.parse(JSON.stringify(validator.pipeline));
                pipeline = replacePlaceholders(pipeline, payload);

                const aggResult = await model.aggregate(pipeline).exec();
                if (aggResult.length > 0) {
                    throw new BadRequestException({
                        message: `Validation failed: ${validator.name}`,
                        description: validator.description,
                        pipeline,
                    });
                }
            } else if (validator.conditions) {
                let conditions = JSON.parse(JSON.stringify(validator.conditions));
                conditions = replacePlaceholders(conditions, payload);

                const existing = await model.findOne(conditions);
                if (existing) {
                    throw new BadRequestException({
                        message: `Validation failed: ${validator.name}`,
                        description: validator.description,
                        conditions,
                    });
                }
            }
        }
    }

}

import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { GenerateApis } from './entities/generate-apis.entity';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import { mongooseTransactionHandler } from 'src/common/func-helper/mongoose-transaction';
import _ from 'lodash';
import { removeDiacritics } from 'src/common/func-helper/conver-value';
import { EntitiesService } from 'src/cores/services/entities.service';
import { ModelsService } from '../models/models.service';
import { PagingDto } from 'src/common/dto/page-result.dto';

@Injectable()
export class GenerateApisService extends BaseService<GenerateApis> {
    baseRepositoryService: BaseRepositoryService<GenerateApis>;
    collection: string = COLLECTION_NAME.GENERATE_APIS;
    constructor(
        @InjectConnection()
        public readonly connection: Connection,
        @InjectModel(COLLECTION_NAME.GENERATE_APIS)
        private readonly generateApisModel: Model<GenerateApis>,
        private readonly modelsService: ModelsService,
        eventEmitter: EventEmitter2
    ) {
        super(connection, generateApisModel, eventEmitter, COLLECTION_NAME.GENERATE_APIS);
        this.baseRepositoryService = new BaseRepositoryService<GenerateApis>(
            generateApisModel,
            this.collection,
            eventEmitter
        )
    }

    async create(
        payload: any,
        user?: CreatedBy,
        id?: string
    ): Promise<{ data: GenerateApis; } | any> {
        const session = await this.connection.startSession();

        const { name, description, url, method, entity, headers, params, query, body } = payload;

        const entityModel = await this.modelsService.findOne(entity);
        if (!entityModel) {
            throw new NotFoundException(`Entity with ID ${entity} not found`);
        }

        let slug = _.get(payload, 'slug', null);
        if (!slug) {
            const name = _.get(payload, 'name', null);
            slug = _.kebabCase(removeDiacritics(name));
        }

        const result = await mongooseTransactionHandler(
            async () => {
                const generateApi = new this.generateApisModel({
                    ...payload,
                    url: entityModel.data.slug
                });
                return this.baseRepositoryService.save(generateApi, { session });
            },
            (error) => {
                throw new Error(`Error creating Generate API: ${error.message}`);
            },
            this.connection,
            session
        );

        return { data: result };
    }

    async handleApiPost(
        payload: any,
        slug: string,
        method: string,
    ): Promise<{ data: GenerateApis | any; }> {
        const api = await this.generateApisModel.findOne({
            method: method.toLowerCase(),
            url: slug,
        })

        if (!api) {
            throw new Error(`API not found for method: ${method}, url: ${slug}`);
        }

        const entity = await this.modelsService.findOne(api.entity.toString())
        const model = await this.modelsService.getModel(entity.data.slug)
        await this.modelsService.checkValidData(
            {
                ...payload,
                _entity: entity.data._id,
            },
            model
        )
        const result = await model.create({
            ...payload,
            _entity: entity.data._id,
        });

        return { data: result };
    }

    async saveData(
        payload: any,
        user?: any,
        id?: string
    ) {

    }
}

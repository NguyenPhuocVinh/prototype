import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { Connection, Document, Model } from "mongoose";
import { IBaseService } from "./interfaces/base-service.interface";
import { Meta } from "src/common/dto/index.dto";
import { PagingDto } from "src/common/dto/page-result.dto";
import { CreatedBy } from "src/common/models/root/created-by-root";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { EventEmitter2 } from "@nestjs/event-emitter";
import _ from "lodash";
import { removeDiacritics } from "src/common/func-helper/conver-value";
import { BaseRepositoryService } from "./repository.service";
import { pagination } from "src/common/func-helper/pagination";
import { mongooseTransactionHandler } from "src/common/func-helper/mongoose-transaction";

@Injectable()
export class BaseService<T extends Document> implements IBaseService<T> {
    baseRepositoryService: BaseRepositoryService<T>;
    constructor(
        @InjectConnection() public connection: Connection,
        @InjectModel('') private readonly model: Model<T>,
        public eventEmitter: EventEmitter2,
        private collectionName: string,
    ) {
        this.baseRepositoryService = new BaseRepositoryService<T>(
            model,
            collectionName,
            eventEmitter
        );
    }

    async create(
        payload: any,
        user: CreatedBy
    ): Promise<{ data: T } | any> {
        const result = new this.model(
            {
                ...payload,
                createdBy: user,
            }
        )
        const slug = _.get(payload, 'slug', null);
        if (!slug) {
            const name = _.get(payload, 'name', null);
            result['slug'] = _.kebabCase(removeDiacritics(name));
        }

        await result.save();

        return {
            data: result
        }
    }

    async findOne(
        id: string,
        options?: { queryParams?: PagingDto, option?: {}, user?: CreatedBy }
    ): Promise<{ data: T | any }> {
        const { queryParams, option, user } = options || {};
        const { select } = queryParams || {};

        const filterQuery = {
            _id: id,
            ...option,
        };

        if (user) {
            filterQuery['$or'] = [];
            queryParams.filterQuery['$or'].push(
                {
                    isActive: true,
                }
            )
        }

        let data = await this.model
            .findOne(filterQuery)
            .select(select)
            .select('-password')
            .lean()

        if (!data) {
            return {
                data: await this.model
                    .findOne({
                        slug: id,
                        ...option,
                        ...queryParams?.filterQuery,
                    })
                    .lean()
                    .select(select)
                    .select('-password'),
            };
        }

        return {
            data,
        };
    }

    async findAll(
        queryParams: PagingDto,
        user?: CreatedBy
    ): Promise<{ data: T[] | any[]; meta: Meta; }> {
        const { page, limit, sort } = queryParams;
        const { sortBy, other } = sort;

        if (user) {
            queryParams.filterQuery['$or'].push(
                {
                    isActive: true,
                }
            )
        }

        const filterQuery = {
            ...queryParams.filterQuery,
        }

        const skip = (page - 1) * limit;
        const result = this.model
            .find(filterQuery)
            .select('-password -long_description -blocks')
            .limit(limit)
            .skip(skip)
            .sort({ [sortBy]: other })
            .lean();

        const total = this.model.countDocuments(filterQuery);

        return Promise.all([result, total]).then(([data, total]) => {
            const meta = pagination(data, page, limit, total);
            return { data, meta };
        });
    }


    async update(
        id: string,
        payload: any,
        user?: CreatedBy
    ): Promise<T> {
        throw new Error("Method not implemented.");

    }

    async delete(id: string, ...args: any[]): Promise<any> {
        const result = await this.deletes([id]);
        return result;
    }

    async deletes(ids: string[], ...args: any[]): Promise<any> {
        const session = await this.connection.startSession();
        const result = await this.model.find({ id: { $in: ids } })

        const transactionHandlerMethod = async () => {
            await this.baseRepositoryService.deleteMany(
                { id: { $in: ids } },
                session
            )
        }

        await mongooseTransactionHandler<void>(
            transactionHandlerMethod,
            (error) => {
                throw new UnprocessableEntityException(error);
            },
            this.connection,
            session,
        )

        return result;
    }

    async isExist(options: any): Promise<any> {
        const result = await this.model.findOne(options);
        return result;
    }

    async findById(id: string): Promise<{ data: any | null }> {
        let data = await this.model.findById(id).lean().select('-password');

        return {
            data,
        };
    }
}
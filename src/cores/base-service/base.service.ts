import { Injectable } from "@nestjs/common";
import { Connection, Document, Model } from "mongoose";
import { IBaseService } from "./interfaces/base-service.interface";
import { Meta } from "src/common/dto/index.dto";
import { PagingDto } from "src/common/dto/page-result.dto";
import { CreatedBy } from "src/common/models/root/created-by-root";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { EventEmitter2 } from "@nestjs/event-emitter";
import _ from "lodash";
import { removeDiacritics } from "src/common/func-helper/conver-value";

@Injectable()
export class BaseService<T extends Document> implements IBaseService<T> {
    constructor(
        @InjectConnection() public connection: Connection,
        @InjectModel('') private readonly model: Model<T>,
        private collectionName: string,
        public eventEmitter: EventEmitter2
    ) { }

    async create(
        payload: any,
        locale: string,
        user: CreatedBy
    ): Promise<{ data: T }> {
        const result = new this.model(
            {
                ...payload,
                createdBy: user,
            }
        )
        const slug = _.get(payload, 'slug', null);
        if (!slug) {
            const name = _.get(payload, 'name', null);
            if (!name) {
                const title = _.get(payload, 'title', null);
                result['slug'] = _.kebabCase(removeDiacritics(title));
            } else {
                result['slug'] = _.kebabCase(removeDiacritics(name));
            }
        }

        await result.save();

        return {
            data: result
        }
    }
    findOne(id: string, locale: string): Promise<{ data: T; }> {
        throw new Error("Method not implemented.");
    }
    findAll(queryParams: PagingDto, locale: string): Promise<{ data: T[]; meta: Meta; }> {
        throw new Error("Method not implemented.");
    }
    update(id: string, payload: any, locale: string): Promise<T> {
        throw new Error("Method not implemented.");
    }
    delete(id: string, ...args: any[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deletes(ids: string[], ...args: any[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
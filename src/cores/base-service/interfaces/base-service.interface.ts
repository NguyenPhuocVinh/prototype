import { Meta } from "src/common/dto/index.dto";
import { PagingDto } from "src/common/dto/page-result.dto";
import { CreatedBy } from "src/common/models/root/created-by-root";

export interface IBaseService<T> {
    create(
        payload: any,
        locale: string,
        user: CreatedBy
    ): Promise<{ data: T | null }>;
    findOne(
        id: string,
        locale: string
    ): Promise<{ data: T | null }>;
    findAll(
        queryParams: PagingDto,
        locale: string
    ): Promise<{
        data: T[];
        meta: Meta
    }>;
    update(
        id: string,
        payload: any,
        locale: string
    ): Promise<T | null>;
    delete(
        id: string,
        ...args: any[]
    ): Promise<any>;
    deletes(
        ids: string[],
        ...args: any[]
    ): Promise<any>;
}
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { FilterQuery } from 'mongoose';
export class PagingDto {
    @IsOptional()
    page: number;

    @IsString()
    @IsOptional()
    sort?: any // SortOption;

    @IsOptional()
    fullTextSearch?: any // FullTextSearch;

    @IsOptional()
    search?: string;

    @IsString()
    @IsOptional()
    search_type: string;

    @IsOptional()
    limit?: number;

    @Transform(({ value }) => Number.parseInt(value))
    @IsOptional()
    id?: number;

    @IsOptional()
    filterQuery: FilterQuery<any>;

    @IsOptional()
    select: string;

    @IsOptional()
    self_questions: boolean;
}   

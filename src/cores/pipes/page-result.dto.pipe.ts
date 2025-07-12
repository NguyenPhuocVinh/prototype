import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PagingDto } from 'src/common/dto/page-result.dto';
import { fullTextSearchConfig, searchConfig, searchConfigSelect, sortConfig } from 'src/common/func-helper/search';


@Injectable()
export class PagingDtoPipe implements PipeTransform {
    transform(value: PagingDto, metadata: ArgumentMetadata): PagingDto {
        const {
            page = 1,
            limit = 10,
            search,
            select = null,
            sort = '-created_at',
            search_type = 'and',
            fullTextSearch,
            self_questions
        } = value;


        const pagingDto = {
            page: Number(page),
            limit: Number(value.limit),
            search,
            sort: sortConfig(String(sort)),
            search_type,
            filterQuery: searchConfig(search, search_type),
            select: searchConfigSelect(select),
            fullTextSearch: fullTextSearchConfig(fullTextSearch, page, limit),
            self_questions: self_questions,
        };

        return pagingDto;
    }
}

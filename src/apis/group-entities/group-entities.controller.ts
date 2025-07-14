import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { GroupEntitiesService } from './group-entities.service';
import { CreateGroupEntityDto } from './dto/create-group-entity.dto';
import { Authorize } from 'src/cores/decorators/authorize.decorator';
import { CheckValidDataDecorator } from 'src/cores/decorators/check-valid-data.decorator';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { PagingDtoPipe } from 'src/cores/pipes/page-result.dto.pipe';
import { PagingDto } from 'src/common/dto/page-result.dto';

@Controller('group-entities')
export class GroupEntitiesController {
    constructor(
        private readonly groupEntitiesService: GroupEntitiesService
    ) { }

    @Post()
    @Authorize()
    @CheckValidDataDecorator({
        collectionName: COLLECTION_NAME.GROUP_ENTITY,
    })
    async createGroupEntity(
        @Body() createGroupEntityDto: CreateGroupEntityDto,
        @Req() req: any,
    ) {
        const user = req.user;
        return await this.groupEntitiesService.create(createGroupEntityDto, user);
    }

    @Put(':id')
    @Authorize()
    // @CheckValidDataDecorator({
    //     collectionName: COLLECTION_NAME.GROUP_ENTITY,
    // })
    async updateGroupEntity(
        @Param('id') id: string,
        @Body() updateGroupEntityDto: CreateGroupEntityDto,
        @Req() req: any,
    ) {
        const user = req.user;
        return await this.groupEntitiesService.update(id, updateGroupEntityDto, user);
    }

    @Get()
    @Authorize()
    async findAll(
        @Req() req: any,
        @Query(new PagingDtoPipe()) pagingDto: PagingDto,
    ) {
        const user = req.user;
        return await this.groupEntitiesService.findAll(pagingDto, user);
    }
}

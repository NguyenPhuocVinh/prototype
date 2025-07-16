import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { ModelsService } from './models.service';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { Authorize } from 'src/cores/decorators/authorize.decorator';
import { CheckValidDataDecorator } from 'src/cores/decorators/check-valid-data.decorator';
import { CreateEntityDto } from './dto/create-entity.dto';

@Controller('models')
export class ModelsController {
    constructor(
        private readonly modelsService: ModelsService
    ) { }

    @Post()
    @Authorize()
    @CheckValidDataDecorator({
        collectionName: COLLECTION_NAME.ENTITY,
    })
    async createModel(
        @Body() createEntityDto: CreateEntityDto
    ) {
        return this.modelsService.create(createEntityDto);
    }

    @Delete(':id')
    @Authorize()
    async delete(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        const user = req.user;
        return await this.modelsService.delete(id, user);
    }

}

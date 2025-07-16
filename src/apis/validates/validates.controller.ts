import { Body, Controller, Post, Req } from '@nestjs/common';
import { ValidatesService } from './validates.service';
import { CheckValidDataDecorator } from 'src/cores/decorators/check-valid-data.decorator';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';

@Controller('validates')
export class ValidatesController {
    constructor(
        private readonly validatesService: ValidatesService
    ) { }

    @Post()
    @CheckValidDataDecorator(
        {
            collectionName: COLLECTION_NAME.VALIDATE
        }
    )
    async create(
        @Body() payload: any,
        @Req() req: any
    ) {
        const user = req.user;
        return this.validatesService.create(payload, user);
    }
}

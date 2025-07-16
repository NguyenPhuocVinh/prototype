import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { GenerateApisService } from './generate-apis.service';
import { ValidatorBodyDecorator } from 'src/cores/decorators/validator-body.decorator';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';

@Controller('generate-apis')
export class GenerateApisController {
    constructor(
        private readonly generateApisService: GenerateApisService,
    ) { }

    @Post()
    async create(
        @Body() createGenerateApiDto: any,
    ) {
        return this.generateApisService.create(createGenerateApiDto);
    }

    @Post('test/:entity')
    @ValidatorBodyDecorator({
        collectionName: COLLECTION_NAME.GENERATE_APIS
    })
    async handlePost(
        @Param('entity') slug: string,
        @Body() body: Record<string, any>,
        @Req() req: { method: string },
    ): Promise<any> {
        return await this.generateApisService.handleApiPost(
            body,
            slug,
            req.method,
        )
    }
}

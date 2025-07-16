import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { GenerateApisService } from './generate-apis.service';
import { ValidatorBodyDecorator } from 'src/cores/decorators/validator-body.decorator';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { CheckDataValidInterceptor } from 'src/cores/interceptors/check-valid-data.interceptor';
import { CheckValidDataDecorator } from 'src/cores/decorators/check-valid-data.decorator';

@Controller('generate-apis')
export class GenerateApisController {
    constructor(
        private readonly generateApisService: GenerateApisService,
    ) { }

    @Post()
    @CheckValidDataDecorator({
        collectionName: COLLECTION_NAME.GENERATE_APIS
    })
    async create(
        @Body() createGenerateApiDto: any,
    ) {
        return this.generateApisService.create(createGenerateApiDto);
    }

    @Post(':type/:entity')
    @ValidatorBodyDecorator({
        collectionName: COLLECTION_NAME.GENERATE_APIS
    })
    async handleApiPost(
        @Param('type') type: string,
        @Param('entity') slug: string,
        @Body() body: Record<string, any>,
        @Req() req: { method: string },
    ): Promise<any> {
        return await this.generateApisService.handleApiPost(
            body,
            slug,
            {
                method: req.method.toLowerCase(),
                type
            }
        )
    }

    @Get(':type/:entity')
    async handleApiGet(
        @Param('type') type: string,
        @Param('entity') slug: string,
        @Req() req: { method: string },
    ): Promise<any> {
        return await this.generateApisService.handleApiGet(
            slug,
            {
                method: req.method.toLowerCase(),
                type
            }
        );
    }
}

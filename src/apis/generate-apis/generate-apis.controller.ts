import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { GenerateApisService } from './generate-apis.service';

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
    async handlePost(
        @Param('entity') slug: string,
        @Body() body: any,
        @Req() req: any,
    ) {
        return await this.generateApisService.handleApiPost(
            body,
            slug,
            req.method,
        )
    }
}

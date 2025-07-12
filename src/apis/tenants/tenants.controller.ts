import { Body, Controller, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
    constructor(
        private readonly tenantsService: TenantsService
    ) { }

    @Post()
    async create(
        @Body() payload: any
    ) {
        return await this.tenantsService.create(payload);
    }
}

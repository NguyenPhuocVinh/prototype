import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateIdentityDto } from './dto/identity/create-identity';
import { Authorize } from 'src/cores/decorators/authorize.decorator';
import { PagingDtoPipe } from 'src/cores/pipes/page-result.dto.pipe';
import { PagingDto } from 'src/common/dto/page-result.dto';

@Controller('drivers')
export class DriversController {
    constructor(
        private readonly driversService: DriversService
    ) { }

    @Post('identity')
    @Authorize()
    async createIdentity(
        @Body() payload: CreateIdentityDto,
        @Req() req: any
    ) {
        const user = req.user;
        const data = await this.driversService.createIdentity(
            payload,
            user,
        )
        return data
    }

    @Get()
    async findAll(
        @Query(new PagingDtoPipe()) queryParams: PagingDto
    ) {
        return this.driversService.findAll(queryParams);
    }
}

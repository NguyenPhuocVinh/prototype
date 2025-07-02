import { Body, Controller, Post, Req } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateIdentityDto } from './dto/identity/create-identity';
import { Authorize } from 'src/cores/decorators/authorize.decorator';

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
}

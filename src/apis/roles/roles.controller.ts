import { Body, Controller, Post, Req } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Authorize } from 'src/cores/decorators/authorize.decorator';
import { AuditDecorator } from 'src/cores/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/cores/event-handler/constants';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
        // private readonly cacheMangerService: CacheMangerService,
    ) { }

    @Post()
    // @Authorize()
    @AuditDecorator({
        event: AUDIT_EVENT.CREATED,
        targetType: COLLECTION_NAME.ROLE,
    })
    async create(
        @Body() createRoleDto: CreateRoleDto,
        @Req() req: any,
    ) {
        const { user } = req;
        const result = await this.rolesService.create(
            createRoleDto,
            user,
        );

        // const cacheKeys: any = await this.cacheMangerService.getCache(
        //     `${appName}:${COLLECTION_NAME.ROLE}`,
        // );

        // await this.cacheMangerService.clearAllCachedKeys(
        //     cacheKeys,
        //     COLLECTION_NAME.ROLE,
        // );
        return result;
    }

}

import { Body, Controller, Post, Req } from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { Authorize } from 'src/cores/decorators/authorize.decorator';
import { AuditDecorator } from 'src/cores/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/cores/event-handler/constants';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';

@Controller('rules')
export class RulesController {
    constructor(
        private readonly rulesService: RulesService,
    ) { }

    @Post()
    // @Authorize()
    @AuditDecorator({
        event: AUDIT_EVENT.CREATED,
        targetType: COLLECTION_NAME.RULE
    })
    async create(
        @Body() createRuleDto: CreateRuleDto,
        @Req() req: any,
    ) {
        const { user } = req;
        const { data } = await this.rulesService.create(createRuleDto, user);
        return data
    }
}

import { Body, Controller, Post, Req } from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { Authorize } from 'src/cores/decorators/authorize.decorator';

@Controller('rules')
export class RulesController {
    constructor(
        private readonly rulesService: RulesService,
    ) { }

    @Post()
    @Authorize()
    async create(
        @Body() createRuleDto: CreateRuleDto,
        @Req() req: any,
    ) {
        const { user } = req;
        const { data } = await this.rulesService.create(createRuleDto, user);
        return data
    }
}

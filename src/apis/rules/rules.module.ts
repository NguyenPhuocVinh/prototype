import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { RuleSchema } from './entities/rule.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION_NAME.RULE,
        schema: RuleSchema
      }
    ])
  ],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService],
})
export class RulesModule { }

import { Module } from '@nestjs/common';
import { EntityRelationsModule } from 'src/apis/entity-relations/entity-relations.module';
import { SchemaService } from './schema.service';

@Module({
    imports: [EntityRelationsModule],
    controllers: [],
    providers: [SchemaService],
})
export class SchemaModule { }

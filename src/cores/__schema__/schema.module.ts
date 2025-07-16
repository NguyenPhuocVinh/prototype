import { Module } from '@nestjs/common';
import { EntityRelationsModule } from 'src/apis/entity-relations/entity-relations.module';
import { SchemaService } from './schema.service';
import { ModelsModule } from 'src/apis/models/models.module';

@Module({
    imports: [
        EntityRelationsModule,
        ModelsModule
    ],
    controllers: [],
    providers: [SchemaService],
})
export class SchemaModule { }

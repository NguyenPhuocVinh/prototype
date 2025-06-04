import { NotFoundController } from './not-found.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [NotFoundController],
    providers: [],
})
export class NotFoundModule {}

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CheckDataExitInterceptor } from '../interceptors/check-data-exists.interceptor';
import { CommonService } from './common.service';
import { CheckDataValidInterceptor } from '../interceptors/check-valid-data.interceptor';

@Module({
    imports: [],
    controllers: [],
    providers: [
        CommonService,
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CheckDataExitInterceptor,
        // },
        {
            provide: APP_INTERCEPTOR,
            useClass: CheckDataValidInterceptor,
        },
    ],
    exports: [CommonService],
})
export class CommonModule { }

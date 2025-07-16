import { Module } from "@nestjs/common";
import { ModelsModule } from "src/apis/models/models.module";
import { APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { ValidatorBodyInterceptor } from "../interceptors/validator-body.interceptor";
import { ValidatorService } from "./validator.service";

@Module({
    imports: [ModelsModule],
    controllers: [],
    providers: [
        ValidatorService,
        {
            provide: APP_INTERCEPTOR,
            useFactory: (reflector: Reflector, validatorService: ValidatorService) => {
                return new ValidatorBodyInterceptor(reflector, validatorService);
            },
            inject: [Reflector, ValidatorService],
        }
    ],
    exports: [ValidatorService],
})
export class ValidatorModule { }
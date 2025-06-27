import { DynamicModule, ForwardReference, Module, Type } from "@nestjs/common";
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { appSettings } from "src/configs/app.config";
import { RoutesFrontModule } from "./router/routes-front.module";
import { NotFoundModule } from "src/apis/not-found/not-found.module";
import { RoutesAdminModule } from "./router/routes-admin.module";

const { apiVersion } = appSettings

@Module({})
export class RouterModule {
    static forRoot(): DynamicModule {
        const imports: (
            | DynamicModule
            | Type<any>
            | Promise<DynamicModule>
            | ForwardReference<any>
        )[] = [];

        imports.push(
            RoutesFrontModule,
            RoutesAdminModule,
            NestJsRouterModule.register([
                {
                    path: ``,
                    children: [
                        {
                            path: ``,
                            module: RoutesAdminModule,
                        },
                        {
                            path: `/front`,
                            module: RoutesFrontModule,
                        }
                    ],
                },
                {
                    path: '*',
                    module: NotFoundModule,
                },
            ]),

        );

        return {
            module: RouterModule,
            providers: [],
            exports: [],
            controllers: [],
            imports,
        };
    }
}

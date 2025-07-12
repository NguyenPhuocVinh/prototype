import { Module } from "@nestjs/common";
import { AuthController } from "src/apis/auth/auth.controller";
import { AuthModule } from "src/apis/auth/auth.module";
import { DriversController } from "src/apis/ships/drivers/drivers.controller";
import { DriversModule } from "src/apis/ships/drivers/drivers.module";
import { MediasController } from "src/apis/medias/medias.controller";
import { MediasModule } from "src/apis/medias/medias.module";
import { RolesController } from "src/apis/roles/roles.controller";
import { UsersController } from "src/apis/users/users.controller";
import { UsersModule } from "src/apis/users/users.module";

@Module({
    imports: [
        AuthModule,
        UsersModule,
        MediasModule,
        DriversModule
    ],
    controllers: [
        AuthController,
        UsersController,
        MediasController,
        DriversController
    ],
})

export class RoutesFrontModule { }
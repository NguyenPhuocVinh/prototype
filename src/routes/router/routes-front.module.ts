import { Module } from "@nestjs/common";
import { AuthController } from "src/apis/auth/auth.controller";
import { AuthModule } from "src/apis/auth/auth.module";
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
    ],
    controllers: [
        AuthController,
        UsersController,
        MediasController,
    ],
})

export class RoutesFrontModule { }
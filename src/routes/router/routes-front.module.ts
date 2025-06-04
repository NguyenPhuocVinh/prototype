import { Module } from "@nestjs/common";
import { AuthController } from "src/apis/auth/auth.controller";
import { AuthModule } from "src/apis/auth/auth.module";
import { RolesController } from "src/apis/roles/roles.controller";
import { UsersController } from "src/apis/users/users.controller";
import { UsersModule } from "src/apis/users/users.module";

@Module({
    imports: [
        AuthModule,
        UsersModule
    ],
    controllers: [
        AuthController,
        UsersController,
    ],
})

export class RoutesFrontModule { }
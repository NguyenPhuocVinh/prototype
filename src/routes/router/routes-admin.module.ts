import { Module } from "@nestjs/common";
import { RoutesFrontModule } from "./routes-front.module";
import { RolesModule } from "src/apis/roles/roles.module";
import { UsersModule } from "src/apis/users/users.module";
import { RulesModule } from "src/apis/rules/rules.module";
import { PermissionsModule } from "src/apis/permissions/permissions.module";
import { RolesController } from "src/apis/roles/roles.controller";
import { PermissionsController } from "src/apis/permissions/permissions.controller";
import { RulesController } from "src/apis/rules/rules.controller";
import { AuthModule } from "src/apis/auth/auth.module";
import { AuthController } from "src/apis/auth/auth.controller";

@Module({
    imports: [
        RolesModule,
        RulesModule,
        PermissionsModule,
    ],
    controllers: [
        RolesController,
        PermissionsController,
        RulesController,
    ],
})

export class RoutesAdminModule extends RoutesFrontModule { }
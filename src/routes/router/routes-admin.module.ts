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
import { AuditsModule } from "src/apis/audits/audits.module";
import { AuditsController } from "src/apis/audits/audits.controller";
import { TenantsModule } from "src/apis/tenants/tenants.module";
import { TenantsController } from "src/apis/tenants/tenants.controller";
import { EntityRelationsModule } from "src/apis/entity-relations/entity-relations.module";
import { GroupEntitiesController } from "src/apis/group-entities/group-entities.controller";
import { GroupEntitiesModule } from "src/apis/group-entities/group-entities.module";
import { ModelsModule } from "src/apis/models/models.module";
import { ModelsController } from "src/apis/models/models.controller";

@Module({
    imports: [
        RolesModule,
        RulesModule,
        PermissionsModule,
        AuditsModule,
        TenantsModule,
        EntityRelationsModule,
        GroupEntitiesModule,
        ModelsModule,
    ],
    controllers: [
        RolesController,
        PermissionsController,
        RulesController,
        AuditsController,
        TenantsController,
        GroupEntitiesController,
        ModelsController
    ],
})

export class RoutesAdminModule extends RoutesFrontModule { }
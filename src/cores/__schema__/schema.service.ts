import { Injectable, OnModuleInit } from "@nestjs/common";
import { Audit } from "src/apis/audits/entities/audit.entity";
import { EntityRelationsService } from "src/apis/entity-relations/entity-relations.service";
import { COLLECTION_NAME } from "./configs/enum";
import { Role } from "src/apis/roles/entities/role.entity";
import { User } from "src/apis/users/entities/user.entity";
import { Driver } from "src/apis/ships/drivers/entities/driver.entity";
import { DriverIdentity, DriverIdentitySchema } from "src/apis/ships/drivers/entities/driver-identity.entity";
import { DriverReview } from "src/apis/ships/drivers/entities/driver-review.entity";
import { getProperties } from "../decorators/property.decorator";
import { getEmbeddedType } from "./configs";
import { EntityRelation } from "src/apis/entity-relations/entities/entity-relation.entity";
import { Permissions } from "src/apis/permissions/entities/permission.entity";
import { File } from "src/apis/medias/entities/medias.entity";
import { Entity } from "src/apis/models/entities/model.entity";
import { GroupEntity } from "src/apis/group-entities/entities/group-entity.entity";
import { Tenant } from "src/apis/tenants/entities/tenant.entity";
import { GenerateApis } from "src/apis/generate-apis/entities/generate-apis.entity";


@Injectable()
export class SchemaService implements OnModuleInit {
    constructor(private readonly entityRelationService: EntityRelationsService) { }

    async onModuleInit() {
        const schemas = [
            {
                entity: Audit,
                collectionName: COLLECTION_NAME.AUDIT,
            },
            {
                entity: File,
                collectionName: COLLECTION_NAME.FILE,
            },
            {
                entity: Role,
                collectionName: COLLECTION_NAME.ROLE,
            },
            {
                entity: Permissions,
                collectionName: COLLECTION_NAME.PERMISSION,
            },
            {
                entity: EntityRelation,
                collectionName: COLLECTION_NAME.ENTITY_RELATION,
            },
            {
                entity: User,
                collectionName: COLLECTION_NAME.USER,
            },
            {
                entity: Entity,
                collectionName: COLLECTION_NAME.ENTITY,
            },
            {
                entity: GroupEntity,
                collectionName: COLLECTION_NAME.GROUP_ENTITY,
            },
            {
                entity: Tenant,
                collectionName: COLLECTION_NAME.TENANT,
            },
            {
                entity: GenerateApis,
                collectionName: COLLECTION_NAME.GENERATE_APIS,
            }
        ];

        for (const schema of schemas) {
            const { entity, collectionName } = schema;
            const properties = getProperties(entity);
            const relations = [];
            for (const property of properties) {
                const { name, type, ref } = property;
                if (ref) {
                    const embeddedType = getEmbeddedType(name, type);
                    relations.push({
                        [ref]: name,
                        embeddedType,
                    });
                }
            }

            await this.entityRelationService.updateRelationsForCollection(
                collectionName,
                relations,
            );
        }
    }
}
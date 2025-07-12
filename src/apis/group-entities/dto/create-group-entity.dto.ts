import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { ExcludeModel } from "src/common/models/exclude.model";
import { ToObjectId } from "src/cores/pipes/transfer-object-id.dto.pipe";

export class CreateGroupEntityDto extends PartialType(ExcludeModel) {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: ['68707fa92852ef3064f7c8c0'],
        required: false,
        description: 'Tenant ID list',
    })
    @IsOptional()
    @ToObjectId()
    tenant: string;
}
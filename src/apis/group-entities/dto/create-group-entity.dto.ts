import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ExcludeModel } from "src/common/models/exclude.model";
import { ToObjectId } from "src/cores/pipes/transfer-object-id.dto.pipe";

export class CreateGroupEntityDto extends PartialType(ExcludeModel) {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

}
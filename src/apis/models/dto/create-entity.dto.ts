import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';
import { Types } from 'mongoose';
import { ToObjectId } from 'src/cores/pipes/transfer-object-id.dto.pipe';

export class CreateEntityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsObject()
    @IsNotEmpty()
    jsonSchema: Record<string, any>;

    @IsObject()
    @IsOptional()
    uiSchema?: Record<string, any>;

    @IsNotEmpty()
    @ToObjectId()
    groupEntity: Types.ObjectId | string;
}

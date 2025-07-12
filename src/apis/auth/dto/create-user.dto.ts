import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsDate,
    IsArray,
    IsMongoId
} from 'class-validator';
import { Type } from 'class-transformer';
import { RelationRoot } from 'src/common/models/root/relation-root';
import { Types } from 'mongoose';
import { ToObjectIdArray } from 'src/cores/pipes/transfer-object-ids.dto.pipe';

export class CreateUserDto {
    @ApiProperty({ example: 'username' })
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty({ example: '0901234567' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'securePassword123' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: '1990-01-01', required: false })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    birthDay?: Date;

    @ApiProperty({
        example: '685e2b3647166fb4e6ac99e0',
        required: false,
        description: 'Role ID (Mongo ObjectId)',
    })
    @IsOptional()
    @IsMongoId()
    role?: string;

    @ApiProperty({
        example: ['68707fa92852ef3064f7c8c0'],
        required: false,
        description: 'Tenant ID list',
    })
    @IsOptional()
    @IsArray()
    @ToObjectIdArray()
    tenants?: Types.ObjectId[];

}

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

export class CreateUserDto {
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

}

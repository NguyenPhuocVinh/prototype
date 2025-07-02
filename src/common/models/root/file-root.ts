import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class FileRoot {
    @ApiProperty({
        type: String,
        description: 'The id of the relation',
        example: '5f9d88e9c3e6a7f4f0b8f4b3',
    })
    @IsNotEmpty()
    _id: Types.ObjectId;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    alt: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    path: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    disk: string;
}

export const filePick = ['_id', 'title', 'slug', 'alt', 'path', 'disk'];

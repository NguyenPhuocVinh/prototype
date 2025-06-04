import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

@Schema()
export class RelationRoot {
    @ApiProperty({
        type: String,
        description: 'The id of the relation',
        example: '5f9d88e9c3e6a7f4f0b8f4b3',
    })
    @IsNotEmpty()
    @Prop({ type: Types.ObjectId, required: true })
    _id: Types.ObjectId;

    @ApiProperty({
        type: String,
        description: 'The title of the relation',
        example: 'the-slug-of-the-relation',
    })
    @IsString()
    @IsNotEmpty()
    @Prop({ type: String, required: true })
    slug: string;

    @ApiProperty({
        type: String,
        description: 'The title of the relation',
        example: 'The title of the relation',
    })
    @IsString()
    @IsOptional()
    @Prop({ type: String, required: false })
    title?: string;

    @ApiProperty({
        type: String,
        description: 'The name of the relation',
        example: 'The name of the relation',
    })
    @IsString()
    @IsOptional()
    @Prop({ type: String, required: false })
    name?: string;

    @ApiProperty({
        type: String,
        description: 'The type of the relation',
        example: 'The type of the relation',
    })
    @IsOptional()
    @Prop({ type: String, required: false })
    type?: string;
}

export const relationRootPick = [
    '_id',
    'id',
    'slug',
    'title',
    'name',
    'type',
    '_seoPaths',
];

import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { transferValueFile } from "src/common/func-helper/transfer-vale-relations";
import { FileRoot } from "src/common/models/root/file-root";
import { ValidateNestedArrayObject } from "src/cores/decorators/validate-nested.decorator";

export class CreateIdentityDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    idNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    idIssueDate: Date;

    @ApiProperty({
        type: FileRoot,
    })
    @IsNotEmpty()
    @ValidateNestedArrayObject(FileRoot, false)
    @Transform(({ value }) => transferValueFile(value))
    idImgFront: FileRoot;

    @ApiProperty({
        type: FileRoot,
    })
    @IsNotEmpty()
    @ValidateNestedArrayObject(FileRoot, false)
    @Transform(({ value }) => transferValueFile(value))
    idImgBack: FileRoot;

    @ApiProperty({
        type: FileRoot,
    })
    @IsNotEmpty()
    @ValidateNestedArrayObject(FileRoot, false)
    @Transform(({ value }) => transferValueFile(value))
    licenseImgFront: FileRoot;

    @ApiProperty({
        type: FileRoot,
    })
    @IsNotEmpty()
    @ValidateNestedArrayObject(FileRoot, false)
    @Transform(({ value }) => transferValueFile(value))
    licenseImgBack: FileRoot;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    licenseIssueDate: Date

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    regIssueDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    plateNumber: string;

    @ApiProperty({
        type: FileRoot,
    })
    @IsNotEmpty()
    @ValidateNestedArrayObject(FileRoot, false)
    @Transform(({ value }) => transferValueFile(value))
    regImgFront: FileRoot;

    @ApiProperty({
        type: FileRoot,
    })
    @IsNotEmpty()
    @ValidateNestedArrayObject(FileRoot, false)
    @Transform(({ value }) => transferValueFile(value))
    regImgBack: FileRoot;

    @ApiProperty({
        type: FileRoot,
    })
    @IsNotEmpty()
    @ValidateNestedArrayObject(FileRoot, false)
    @Transform(({ value }) => transferValueFile(value))
    avatar: FileRoot;
}
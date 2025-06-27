import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';

export class CreatePermissionDto {
    @ApiProperty({ enum: COLLECTION_NAME })
    @IsEnum(COLLECTION_NAME)
    @IsNotEmpty()
    name: COLLECTION_NAME;

    @ApiProperty({ enum: COLLECTION_NAME })
    @IsEnum(COLLECTION_NAME)
    @IsNotEmpty()
    entityName: COLLECTION_NAME;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        type: [String],
        description: 'Array of rule IDs',
        example: ['64fa5b7a1c8f7d2e6d2e5a9b'],
    })
    @IsOptional()
    @IsString({ each: true })
    rules: string[];

    @ApiProperty({
        type: [String],
        description: 'Array of permission IDs',
        example: ['64fa5b7a1c8f7d2e6d2e5a9b'],
    })
    @IsOptional()
    @IsString({ each: true })
    permissions: string[];
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExcludeModel } from 'src/common/models/exclude.model';

export class CreateRuleDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({
        type: String,
        description: 'Description of the rule',
        required: false,
    })
    @IsOptional()
    @IsString()
    description: string;
}

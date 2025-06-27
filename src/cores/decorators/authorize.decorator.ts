import { UseGuards, applyDecorators } from '@nestjs/common';
import { Permissions } from './permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';

export const Authorize = (...args: string[]) => {
    return applyDecorators(
        Permissions(...args),
        UseGuards(JwtAuthGuard, PermissionsGuard),
    );
};

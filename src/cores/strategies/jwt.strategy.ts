import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Types } from 'mongoose';
import { RolesService } from 'src/apis/roles/roles.service';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import { appSettings } from 'src/configs/app.config';

interface Payload extends CreatedBy {
    iat: number;
    exp: number;
    iss: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly rolesService: RolesService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: appSettings.jwt.secret,
            issuer: appSettings.jwt.issuer,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: Payload, done: any) {
        const { role } = payload;

        // const roleData = await this.rolesService.findPermissionsByRoles(
        //     roles.map((role) => new Types.ObjectId(role._id)),
        // );

        let permissions = [];
        // Array(roleData).forEach((role) => {
        //     permissions.push(Object.keys(role[0].permissions));
        // });

        return {
            ...payload,
            _id: new Types.ObjectId(payload._id),
            // permissions: permissions.flat(),
            // rules: roleData[0]?.rules || [],
            // rulePermissions: roleData[0]?.rulePermissions,
        };
    }
}

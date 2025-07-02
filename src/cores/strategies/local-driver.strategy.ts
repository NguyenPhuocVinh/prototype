import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { Strategy } from 'passport-local';
import { DriversService } from 'src/apis/drivers/drivers.service';

@Injectable()
export class LocalDriverStrategy extends PassportStrategy(Strategy, 'local-driver') {
    constructor(
        private readonly driverService: DriversService,
    ) {
        super({
            usernameField: 'phone',
            passwordField: 'password',
            passReqToCallback: true,
        });
    }
    async validate(req: any, phone: string, password: string) {
        let user = await this.driverService.validateDriver(phone, password);

        if (!user) {
            return undefined;
        }
        console.log("🚀 ~ LocalDriverStrategy ~ validate ~ user:", user)

        const result = _.pick(user, [
            '_id',
            'lastName',
            'firstName',
            'fullName',
            'email',
            'phone',
            'role',
        ])
        console.log("🚀 ~ LocalDriverStrategy ~ validate ~ result:", result)

        return result;
    }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/apis/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UsersService,
    ) {
        super({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        });
    }
    async validate(req: any, email: string, password: string) {
        let user = await this.userService.validateUser(email, password);

        if (!user) {
            return undefined;
        }

        const result = _.pick(user, [
            '_id',
            'id',
            'last_name',
            'first_name',
            'email',
            'roles',
            'tenants'
        ])

        return result;
    }
}

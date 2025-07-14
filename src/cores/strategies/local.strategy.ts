import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { Types } from 'mongoose';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/apis/users/users.service';
import { CreatedBy } from 'src/common/models/root/created-by-root';

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
            'lastName',
            'firstName',
            'email',
            'phone',
            'role',
        ]) as CreatedBy;

        result.tenant = new Types.ObjectId('68707fa92852ef3064f7c8c0')

        return result;
    }
}

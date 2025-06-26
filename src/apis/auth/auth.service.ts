import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import { appSettings } from 'src/configs/app.config';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register(
        createUserDto: CreateUserDto
    ) {
        const {
            email,
            phone,
            password,
        } = createUserDto;

        const isExist = await this.usersService.isExist(email || phone);
        if (isExist) throw new UnprocessableEntityException('User already exists.');

        const user = await this.usersService.create({
            ...createUserDto,
        })

        return user;
    }

    async login(
        user: CreatedBy
    ) {
        const tokens = await this.getTokens(user);
        return {
            ...tokens,
            user: {
                _id: user._id,
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                roles: user.roles,
                tenants: user.tenants,
            },
        }
    }

    private async getTokens(payload: CreatedBy) {
        const { _id } = payload;
        const refreshToken = await this.jwtService.signAsync(
            { _id },
            {
                expiresIn: appSettings.jwt.refreshExpiresIn,
                secret: appSettings.jwt.secret,
            },
        );

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            refreshToken,
        };
    }
}

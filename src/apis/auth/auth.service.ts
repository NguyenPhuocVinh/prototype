import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import { appSettings } from 'src/configs/app.config';
import { DriversService } from '../ships/drivers/drivers.service';
import { CreateDriverDto } from '../ships/drivers/dto/create-driver.dto';
import { Driver } from '../ships/drivers/entities/driver.entity';
import _ from 'lodash';
import { Types } from 'mongoose';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly driversService: DriversService,
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

        const isExist = await this.usersService.isExist({ email });
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
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                role: user.role,
            },
        }
    }

    async refreshToken(
        id: string,
        refreshToken: string,
        tenant: string
    ): Promise<{
        data: {
            accessToken: string;
            refreshToken: string;
            user: CreatedBy
        }
    }> {
        const user = await this.usersService.isExist({ _id: id });
        if (!user) {
            throw new UnauthorizedException(
                'user_not_found',
                'User not found',
            );
        }

        if (!tenant) {
            throw new UnauthorizedException(
                'tenant_not_found',
                'Tenant not found',
            );
        }

        const result: CreatedBy = _.pick(user, [
            '_id',
            'lastName',
            'firstName',
            'email',
            'role',
            'tenant',
        ]);

        result.tenant = new Types.ObjectId(tenant);

        const tokens = await this.getTokens(result);
        return {
            data: {
                ...tokens,
                user: result
            }
        };

    }

    async regiserDriver(
        payload: CreateDriverDto
    ): Promise<{ data: Partial<Driver> }> {
        const {
            phone,
        } = payload;

        const isExist = await this.driversService.isExist({
            phone: phone,
        });
        if (isExist) throw new UnprocessableEntityException('Driver already exists.');
        const driver = await this.driversService.create(
            payload
        );
        return {
            data: driver
        };
    }

    async loginDriver(
        driver: CreatedBy
    ): Promise<{
        data: {
            accessToken: string;
            refreshToken: string;
            driver: any
        }
    }> {
        const tokens = await this.getTokens(driver);
        return {
            data: {
                ...tokens,
                driver
            }
        };
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

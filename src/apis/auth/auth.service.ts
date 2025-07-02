import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import { appSettings } from 'src/configs/app.config';
import { DriversService } from '../drivers/drivers.service';
import { CreateDriverDto } from '../drivers/dto/create-driver.dto';
import { Driver } from '../drivers/entities/driver.entity';
import _ from 'lodash';


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
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                role: user.role,
            },
        }
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

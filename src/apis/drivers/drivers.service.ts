import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { Driver } from './entities/driver.entity';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { DriverIdentity } from './entities/driver-identity.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import { CreateDriverDto } from './dto/create-driver.dto';
import * as bcrypt from 'bcrypt';
import _ from 'lodash';
import { CreateIdentityDto } from './dto/identity/create-identity';


@Injectable()
export class DriversService extends BaseService<Driver> {
    baseRepositoryService: BaseRepositoryService<Driver>;
    collection: string = COLLECTION_NAME.DRIVER;
    constructor(
        @InjectModel(COLLECTION_NAME.DRIVER)
        private readonly driverModel: Model<Driver>,
        @InjectModel(COLLECTION_NAME.DRIVER_IDENTITY)
        private readonly driverIdentityModel: Model<DriverIdentity>,
        @InjectConnection()
        public readonly connection: Connection,
        eventEmitter: EventEmitter2,
    ) {
        super(connection, driverModel, eventEmitter, COLLECTION_NAME.DRIVER);
        this.baseRepositoryService = new BaseRepositoryService(
            driverModel,
            COLLECTION_NAME.DRIVER,
            eventEmitter,
        );
    }

    async create(
        payload: CreateDriverDto,
    ): Promise<{ data: Driver } | any> {
        const driverIdentity = new this.driverModel(
            {
                ...payload,
                password: await bcrypt.hash(payload.password, 10),
            }
        )
        await driverIdentity.save();
        return _.omit(driverIdentity.toObject(), ['password', 'isVerified', 'phoneVerified', 'aiChecked']);
    }

    async validateDriver(
        phone: string,
        password: string
    ): Promise<Driver | null> {
        if (!phone || !password) {
            throw new UnprocessableEntityException(
                'phone_password_incorrectly',
                'Phone or password incorrectly',
            );
        }

        const user = await this.driverModel.findOne({ phone });

        const isMatch =
            user &&
            user.password &&
            (await bcrypt.compare(password, user.password));

        if (isMatch) {
            return user;
        }

        throw new UnprocessableEntityException(
            'phone_password_incorrectly',
            'Phone or password incorrectly',
        );
    }

    async createIdentity(
        payload: CreateIdentityDto,
        driver: CreatedBy,
    ): Promise<{ data: DriverIdentity }> {
        const { avatar } = payload;
        const driverIdentity = new this.driverIdentityModel(
            {
                ...payload,
                createdBy: driver._id,
            }
        )
        await driverIdentity.save();
        const user = await this.driverModel.findByIdAndUpdate(
            driver._id,
            {
                driverIdentity: driverIdentity._id,
                avatar
            },
            {
                new: true,
                fields: {
                    driverIdentity: 1,
                },
            },
        )
        const driverIdentityData = await this.driverIdentityModel.findById(
            driverIdentity._id,
        )
        return {
            data: driverIdentityData
        };
    }
}

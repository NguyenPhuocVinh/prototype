import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { User } from './entities/user.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../auth/dto/create-user.dto';
@Injectable()
export class UsersService extends BaseService<User> {
    constructor(
        @InjectConnection()
        public readonly connection: Connection,
        @InjectModel(COLLECTION_NAME.USER)
        private readonly userModel: Model<User>,
        eventEmitter: EventEmitter2
    ) {
        super(
            connection,
            userModel,
            eventEmitter,
            COLLECTION_NAME.USER
        )
    }

    async create(
        createUserDto: CreateUserDto,
    ): Promise<{ data: User; }> {
        const count = await this.userModel.countDocuments()

        const result = new this.userModel({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
        })

        await result.save();
        return {
            data: result
        }
    }

    async isExist(
        payload: string
    ) {
        const user = await this.userModel.findOne({
            $or: [
                { email: payload },
                { phone: payload }
            ]
        }).lean();

        return !!user;
    }

    async validateUser(
        email: string,
        password: string
    ): Promise<User | null> {
        if (!email || !password) {
            throw new UnprocessableEntityException(
                'email_password_incorrectly',
                'Email or password incorrectly',
            );
        }

        const user = await this.userModel.findOne({ email });

        const isMatch =
            user &&
            user.password &&
            (await bcrypt.compare(password, user.password));

        if (isMatch) {
            return user;
        }

        throw new UnprocessableEntityException(
            'email_password_incorrectly',
            'Email or password incorrectly',
        );
    }
}

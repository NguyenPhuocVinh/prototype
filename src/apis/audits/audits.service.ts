import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { Audit } from './entities/audit.entity';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AUDIT_EVENT } from 'src/cores/event-handler/constants';

@Injectable()
export class AuditsService extends BaseService<Audit> {
    baseRepositoryService: BaseRepositoryService<Audit>;
    collection: string = COLLECTION_NAME.AUDIT;
    constructor(
        @InjectConnection() public readonly connection: Connection,
        @InjectModel(COLLECTION_NAME.AUDIT) private auditsModel: Model<Audit>,
        eventEmitter: EventEmitter2,
    ) {
        super(connection, auditsModel, eventEmitter, COLLECTION_NAME.AUDIT);
        this.baseRepositoryService = new BaseRepositoryService(
            auditsModel,
            this.collection,
            eventEmitter,
        );
    }

    async create(data: any) {
        const audit = new this.auditsModel(data);
        const { event, targetType, targetId } = audit;

        if (event === AUDIT_EVENT.UPDATED) {
            audit['oldValues'] = await this.findOldData(
                targetId,
                targetType,
            );
        }
        const result = await audit.save();
        return {
            data: result,
        }
    }

    async findOldData(targetId: string, targetType: string) {
        const result = await this.auditsModel
            .findOne({
                $and: [
                    {
                        event: {
                            $in: [AUDIT_EVENT.CREATED, AUDIT_EVENT.UPDATED],
                        },
                    },
                    {
                        targetType,
                    },
                    {
                        targetId,
                    },
                ],
            })
            .sort({ createdAt: -1 })
            .limit(1);

        return result?.newValues || {};
    }

    async findAllDataChange(fromDate: Date, toDate: Date) {
        const data = await this.auditsModel
            .find({
                $and: [
                    {
                        created_at: {
                            $gte: fromDate,
                            $lte: toDate,
                        },
                        event: {
                            $in: [
                                AUDIT_EVENT.CREATED,
                                AUDIT_EVENT.UPDATED,
                                AUDIT_EVENT.DELETED,
                            ],
                        },
                    },
                ],
            })
            .sort({ createdAt: -1 });

        return data;
    }

    async countUserRequest(userAgent: string, ipAddress: string) {
        return await this.auditsModel
            .find({
                event: AUDIT_EVENT.UPLOAD_FILE_FRONT,
                ip_address: ipAddress,
                user_agent: userAgent,
            })
            .countDocuments();
    }
}

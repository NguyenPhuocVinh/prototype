import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const tenant = req.headers['x-tenant-id'];
        if (tenant && typeof tenant === 'string') {
            (req as any).tenant = new Types.ObjectId(tenant);
        } else {
            throw new Error('X-TENANT-ID header is required');
        }
        next();
    }
}
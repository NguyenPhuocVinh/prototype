import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { MultipleLanguageMongoErrorMessages } from './configs';
import moment from 'moment';
import { appSettings } from 'src/configs/app.config';

@Catch(MongoError)
export class MongoErrorExceptionFilter implements ExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        const request = host.switchToHttp().getRequest<Request>();
        const locale = request['params']?.locale || 'vi';

        const status = HttpStatus.UNPROCESSABLE_ENTITY;

        const codeError = exception.code;
        response.status(status).json({
            statusCode: status,
            timestamp: moment().tz(appSettings.timezone).toDate(),
            path: request.url,
            message:
                MultipleLanguageMongoErrorMessages(codeError)[locale] ||
                exception.message,
        });
    }
}

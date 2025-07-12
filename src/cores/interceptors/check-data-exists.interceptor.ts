import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class CheckDataExitInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const { body } = req;

        // Assuming the interceptor checks if 'name' exists in the request body
        if (!body || !body.name) {
            throw new Error("Data does not exist");
        }

        // Proceed to the next handler if data exists
        return next.handle();
    }
}
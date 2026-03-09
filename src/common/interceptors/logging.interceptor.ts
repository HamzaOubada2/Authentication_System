import { CallHandler, ExecutionContext, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';


export class LogginIntrceptor implements NestInterceptor {
    private logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const start = Date.now();

        // Executing in controller
        return next.handle().pipe(
            // Tap allows us to excutr code after response is finishid
            tap(() => {
                const ms = Date.now() - start;
                this.logger.log(`${method} ${url} - ${ms}ms`)
            })
        )
    }
}
/*
    1- Take method & url from request
    2- Record the start time of executing
    3- wait for the controller to finished
    4- Calcule how long the order took in milliseconds
    5- Recorde log like: GET /users - 12ms
                        POST /auth/login - 45ms
*/


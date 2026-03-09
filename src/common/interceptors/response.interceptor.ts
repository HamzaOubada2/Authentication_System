import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {

        const statusCode = context.switchToHttp().getResponse().statusCode;

        return next.handle().pipe(
            map((data) => ({
                success: true,
                statusCode,
                data,
                timeStamp: new Date().toISOString(), // Example: 2026-03-09T01:10:22.111Z
            }))
        );
    }
}

/*
    1- request Comms GET /users:
            @Get()
             findAll(){
                return this.userService.findAll();
            }
            return [{ "id":1, "name":"hamza" }]
    2- next.handle() -> This is the implementation of the controller.
    3- map() take response from controller and convert to new response
    4- Build new Strucutre of JSON
        {
            success: true,
            statusCode: 200,
            data: [...]
            timeStamp: "2026..."
        }
*/

/*
Client Request
      ↓
Controller
      ↓
Service
      ↓
Return data
      ↓
Interceptor (map)
      ↓
Transform response
      ↓
Client
*/
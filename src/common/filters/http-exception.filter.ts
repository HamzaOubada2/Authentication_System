// src/common/filters/http-exception.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

@Catch() // Catch All Exceptions (like: BadRequestException, NotFoundException)
export class HttpExceptionFilter implements ExceptionFilter {
    private logger = new Logger('ExceptionFilter'); // create logger to capture errors

    catch(exception: unknown, host: ArgumentsHost) { // Exception: error li tra |||| host => context contain req&res
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // get status code(if error= NotFound... we take status(404) & if Database error status(500))
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // get message
        const message =
            exception instanceof HttpException
                ? (exception.getResponse() as any).message || exception.message
                : 'Internal server error';

        // log the error
        this.logger.error(`${request.method} ${request.url} — ${status}: ${message}`);//GET /users — 404: User not found

        // send standard error response
        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
        });
        /*
            Example response:
            {
                "success": false,
                "statusCode": 404,
                "message": "User not found",
                "timestamp": "2026-03-09T01:40:00Z"
            }
        */
    }
}

/* 
        -This function capture errors(exceptions) that occur in the application and return a unified(موحد) response
    with the error logged in the loggs errors in like(controller,services,pipes,guards...)
*/
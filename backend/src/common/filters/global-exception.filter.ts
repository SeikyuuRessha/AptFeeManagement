import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { AppException } from "../exception/app-exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let responseBody: any;

        if (exception instanceof AppException) {
            status = HttpStatus.BAD_REQUEST;
            responseBody = {
                code: exception.code,
                msg: exception.msg,
                data: exception.data || null,
            };
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            responseBody = {
                code: 0,
                msg:
                    typeof exceptionResponse === "string"
                        ? exceptionResponse
                        : (exceptionResponse as any).message || "HTTP Exception",
                data: null,
            };
        } else {
            responseBody = {
                code: 0,
                msg: "Internal server error",
                data: null,
            };
        }

        response.status(status).json(responseBody);
    }
}

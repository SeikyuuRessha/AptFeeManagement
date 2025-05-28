import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const msg =
            typeof exceptionResponse === "string"
                ? exceptionResponse
                : (exceptionResponse as any).message || "Unknown error";

        response.status(status).json({
            code: 0,
            msg,
            data: null,
        });
    }
}

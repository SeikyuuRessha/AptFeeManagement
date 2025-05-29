import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AppException } from "../exception/app-exception";
import { ExceptionCode } from "../exception/exception-code";

@Injectable()
export class AccessTokenGuard extends AuthGuard("jwt") {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        // If there's an error or no user, throw our custom exception
        if (err || !user) {
            throw new AppException(ExceptionCode.UNAUTHORIZED);
        }
        return user;
    }
}

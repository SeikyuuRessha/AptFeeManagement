// roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { ROLES_KEY } from "../decorators/roles.decorator";
import { AppException } from "../exception/app-exception";
import { ExceptionCode } from "../exception/exception-code";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(), // method level
            context.getClass(), // controller level
        ]);
        if (!requiredRoles) {
            return true; // No roles required -> allow access
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new AppException(ExceptionCode.UNAUTHORIZED);
        }
        // user.role is a single string
        const hasRequiredRole = requiredRoles.includes(user.role);
        if (!hasRequiredRole) {
            throw new AppException(ExceptionCode.FORBIDDEN);
        }
        return true;
    }
}

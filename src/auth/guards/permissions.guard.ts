import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // 1- read required permissions from @Permissions() decorator
        // Example: @Permissions('user: create') => requiredPermissions = ['user: create']
        // search in route handler and controller
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()]
        )

        // if no permissions required => allow access
        if (!requiredPermissions) return true;

        const { user } = context.switchToHttp().getRequest();

        // check if user has required permissions
        /*
            Example:
            requiredPermissions = ['user:create']
            user.permissions = ['user:create','user:read']
            Soo TRUE
        */
        const hasPermission = requiredPermissions.every((permission) => // Every => all permissions required | some => just one permission required
            user?.permissions?.includes(permission)
        )
        if (!hasPermission) throw new ForbiddenException('Insufficient permissions');
        return true;
    }
}
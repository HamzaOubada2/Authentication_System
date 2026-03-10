import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";




//RoleGuard => check if user has required role to access the route
// if user doesn't have required role => throw ForbiddenException
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    // Reflector => used to read metadata from decorators
    // Example: read roles from @Roles('admin') decorator
    private reflector: Reflector
  ) { }

  canActivate(context: ExecutionContext): boolean {
    // Search for roles metadata in the route handler and controller
    // Example: @Roles('admin') => roles = ['admin']
    const requiredRoles = this.reflector.getAllAndOverride<string[]>( // Hada howa li jana Men decorator
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If not have any things like @roles passs 
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();

    const { user } = request;
    /*
      request.user = {
        id: 1,
        email: "hamza@test.com",
        roles: ["admin"]
      }
    */

    // Check if user has required role
    // Example: user.roles = ['admin', 'user'] => hasRole = true if requiredRoles = ['admin']
    const hasRole = requiredRoles.some((role) =>
      user?.roles?.includes(role)
    );

    if (!hasRole) {
      throw new ForbiddenException("Insufficient role");
    }
    return true;
  }
}

/*
  1- read required roles from @Roles() decorator
  2- get user from request
  3- check if user have required role
  4- if user doesn't have required role => throw ForbiddenException
*/
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Observable } from "rxjs";


@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization']

        //Check If headers Exists
        if (!authHeader || !authHeader.startWith('Bearer '))
            throw new UnauthorizedException('No token provided')

        // extract Token
        const token = authHeader.split(' ')[1];

        // 3. verify token → attach user to request
        const payload = await this.authService.verifyAccessToken(token);
        request.user = payload;

        return true;
    }
}
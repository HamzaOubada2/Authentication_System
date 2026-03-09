// src/auth/guards/jwt-auth.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private logger = new Logger('JwtAuthGuard');

    constructor(
        @Inject(forwardRef(() => AuthService)) // ← ADD THIS
        private authService: AuthService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        this.logger.log('Auth Header: ' + authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer '))
            throw new UnauthorizedException('No token provided');

        const token = authHeader.split(' ')[1];

        try {
            const payload = await this.authService.verifyAccessToken(token);
            this.logger.log('Payload: ' + JSON.stringify(payload));
            request.user = payload;
            return true;
        } catch (e) {
            this.logger.error('Guard error: ' + e.message);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
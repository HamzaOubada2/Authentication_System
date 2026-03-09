import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }

    @Get('verify-email')
    verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token) // ← ADD return
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Post('refresh')
    refresh(@Body() body: { userId: number; refreshToken: string }) {
        return this.authService.refresh(body.userId, body.refreshToken)
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@CurrentUser() user: any) {
        return this.authService.logout(user.sub)
    }

    @Post('forgot-password')
    forgotPassword(@Body() dto: ForgotPasswordDto) { // ← REMOVE @Query
        return this.authService.forgotPassword(dto);
    }

    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }
}
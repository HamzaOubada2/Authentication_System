import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/mail/mail.service";
import { UserService } from "src/users/users.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private config: ConfigService,
        private mailService: MailService
    ) { }

    //-------- REGISTER --------------------------------
    async register(dto: RegisterDto) {
        //1- check if email already exists
        const exists = await this.userService.findByEmail(dto.email);
        if (exists) throw new ConflictException('Email Already in use')

        //2- hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        //3- generate email verification token
        const verifyToken = crypto.randomBytes(32).toString('hex');

        //4- Create User
        const user = await this.userService.create({
            email: dto.email,
            password: hashedPassword,
            verificationToken: verifyToken
        })

        //5- assign default role
        await this.userService.assignDefaultRole(user)

        //6- send verification email
        await this.mailService.sendVerificationEmail(user.email, verifyToken)

        return { message: 'Registration successful! Please verify you email' }
    }

    //--------- VERIFY EMAIL --------------------------------------
    async verifyEmail(token: string) {
        const user = await this.userService.findByVerifyToken(token);
        if (!user) throw new BadRequestException('Invalid Or expired verification token')

        await this.userService.markAsVerified(user.id);

        return { message: 'Email Verified successfully! You can new login' }
    }

    //----------- LOGIN -----------------------------------
    async login(dto: LoginDto) {
        // 1- Find User
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        // 2- Check Password:
        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) throw new UnauthorizedException('Invalid Credentials');

        // 3- check if email is verified
        if (!user.isVerified)
            throw new ForbiddenException('Please verify your email before loggin in');

        // 4- generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.roles);

        // 5- save hashed refresh token
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    // ---------- REFRESH TOKENS---------------------------------
    async refresh(userId: number, refreshToken: string) {
        // 1- find user
        const user = await this.userService.findById(userId);
        if (!user || !user.refreshToken)
            throw new UnauthorizedException('Access denied')

        // 2- compare refresh token with hashed one in DB
        const tokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!tokenMatch) throw new UnauthorizedException('Access denied');

        // 3- Generate new Tokens
        const tokens = await this.generateTokens(user.id, user.email, user.roles);
        await this.saveRefreshToken(user.id, tokens.refreshToken)

        return tokens;
    }

    // -------------- FORGOT PASSWORD -------------------------------
    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.userService.findByEmail(dto.email);

        if (!user)
            return { message: 'If This email exists, a reset link has been sent.' }

        // 1- Generate reset Token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // 2- hash it before saving
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // 3- set expiry to 1 hour from now
        const exp = new Date(Date.now() + 1000 * 60 * 60);

        // 4- save to DB
        await this.userService.updateResetToken(user.id, hashedToken, exp);

        // 5- send Email with RAW token (not hashed)
        await this.mailService.sendResetPassword(user.email, resetToken);

        return { message: 'If this email exists, a reset link has been sent.' }
    }

    // -------------------- RESET PASSWORD -------------------------------------------
    async resetPassword(dto: ResetPasswordDto) {
        // 1- find user have reset token
        // This get all users have token + not expired
        const users = await this.userService.FindAllWithResetToken();
        const user = await Promise.all(
            // Make map on each user and compare with  token of user & token hashed
            users.map(async (u) => {
                const match = await bcrypt.compare(dto.token, u.resetToken);
                return match ? u : null;
            })
        ).then((results) => results.find(Boolean));
        if (!user) throw new BadRequestException('Invalid or expire reset token');

        // 2- check token expiry
        if (new Date() > user.resetTokenExpiration)
            throw new BadRequestException('Reset token has expired')

        // 3- comare token with hashed one in DB
        const tokenMatch = await bcrypt.compare(dto.token, user.resetToken);
        if (!tokenMatch) throw new BadRequestException('Invalid or expired reset token');

        // 4- hash new Password
        const hashPassword = await bcrypt.hash(dto.newPassword, 10);

        // 5- update password + clear reset token
        await this.userService.updatePassword(user.id, hashPassword);
        return { message: 'Password reset successfully! You can now Login' }
    }

    // --------------------- VERIFY ACCESS TOKEN (used by guard)-----------------------------
    async verifyAccessToken(token: string) {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.config.get('JWT_SECRET'),
            })
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');

        }
    }

    //----------HELPERS--------------------------
    private async generateTokens(id: number, email: string, roles: any[]) {
        //Exctract Name of roles
        const roleNames = roles.map((r) => r.name);
        //extract permissions
        // flatMap => Collects permissions in one array
        /*
            [
                "create_user",
                "delete_user",
                "edit_post"
            ]
        */
        const permissions = roles.flatMap((role) =>
            role.permissions.map((p: any) => p.name)
        );

        const payload = { sub: id, email, roles: roleNames, permissions };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: '15m'
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d'
            }),
        ]);

        return { accessToken, refreshToken }
    }

    //Save refresh Token in database
    private async saveRefreshToken(userId: number, token: string) {
        const hashed = await bcrypt.hash(token, 10);
        await this.userService.updateRefreshToken(userId, hashed)
    }
}


/* AuthService
    ├── register()        → hash password + send verify email
    ├── verifyEmail()     → activate account
    ├── login()           → validate + return tokens
    ├── refresh()         → validate refresh token + return new tokens
    ├── logout()          → clear refresh token
    ├── forgotPassword()  → generate reset token + send email
    ├── resetPassword()   → validate token + update password
    └── generateTokens()  → JWT with roles + permissions in payload 
*/
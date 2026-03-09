// src/auth/auth.module.ts
import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MailModule } from "../mail/mail.module";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        MailModule,
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule { }
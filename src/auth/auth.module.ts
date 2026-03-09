import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/users/users.module";
import { MailModule } from "src/mail/mail.module";
import { JwtModule } from "@nestjs/jwt";



@Module({
    imports: [
        UserModule,
        MailModule,
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule { }
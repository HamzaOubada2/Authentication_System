import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    constructor(private config: ConfigService) {
        //----------------SETUP MAILTRAP TRANSPORTER-------------------
        this.transporter = nodemailer.createTransport({
            host: this.config.get('MAIL_HOST'),
            port: this.config.get('MAIL_PORT'),
            auth: {
                user: this.config.get('MAIL_USER'),
                pass: this.config.get('MAIL_PASS')
            }
        })
    }

    //----------------------- Verify Email -----------------------------
    async sendVerificationEmail(email: string, token: string) {
        const url = `${this.config.get('APP_URL')}/api/auth/verify-email?token=${token}`

        await this.transporter.sendMail({
            from: '"Auth App" <no-replay@authapp.com>',
            to: email,
            subject: 'Please Verify your Email',
            html: `
                <h2>Welcome! 👋</h2>
                <p>Click the button below to verify your email address:</p>
                <a href="${url}" style="
                background: #4F46E5;
                color: white;
                padding: 12px 24px;
                border-radius: 6px;
                text-decoration: none;
                display: inline-block;
                margin: 16px 0;
                ">
                Verify Email
                </a>
                <p>Or copy this link: <a href="${url}">${url}</a></p>
                <p>This link expires in <strong>24 hours</strong>.</p>
            `,
        });
    }

    // ─── RESET PASSWORD ───────────────────────────────────────
    async sendResetPassword(email: string, token: string) {
        const url = `${this.config.get('APP_URL')}/api/auth/reset-password?token=${token}`

        await this.transporter.sendMail({
            from: '"Auth App" <no-replay@authapp.com>',
            to: email,
            subject: 'Reset Your password',
            html: `
                <h2>Password Reset Request 🔑</h2>
                <p>Click the button below to reset your password:</p>
                <a href="${url}" style="
                background: #DC2626;
                color: white;
                padding: 12px 24px;
                border-radius: 6px;
                text-decoration: none;
                display: inline-block;
                margin: 16px 0;
                ">
                Reset Password
                </a>
                <p>Or copy this link: <a href="${url}">${url}</a></p>
                <p>This link expires in <strong>1 hour</strong>.</p>
                <p>If you didn't request this, ignore this email.</p>
            `,
        });
    }
}


/* 
    MailService:
                -> sendVerificationEmail() //Sends lint to verify account
                -> sendResetPasswordEmail() // sends link to reset password

    !💡 Both emails send a token in the URL — the user clicks it → our API reads the token → validates it → takes action.
*/
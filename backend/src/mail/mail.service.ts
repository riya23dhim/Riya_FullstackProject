import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),

            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }

    async sendPasswordResetEmail(to: string, resetLink: string) {

        console.log("riya ji")
        try {
            await this.transporter.sendMail({
                from: '"Nexus Support" <support@nexus.com>',
                to,
                subject: 'Password Reset Request',
                html: `
                <h1>Reset Your Password</h1>
                <a href="${resetLink}">Reset Password</a>
            `,
            });

            console.log("done");
        } catch (error) {
            console.error("MAIL ERROR:", error);
            throw error;

        }
    }
}

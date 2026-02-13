import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service'; // Import MailService
import { randomBytes } from 'crypto';
console.log("hi")
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService,
        private mailService: MailService, // Inject MailService
    ) { }

    async signup(createUserDto: SignupDto) {
        const user = await this.usersService.create(createUserDto);
        const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
        const rtHash = await bcrypt.hash(tokens.refreshToken, 10);
        await this.usersService.addRefreshToken(user._id.toString(), rtHash);
        return {
            tokens,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    async login(loginDto: any) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || user.isDeleted) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
        const rtHash = await bcrypt.hash(tokens.refreshToken, 10);
        await this.usersService.addRefreshToken(user._id.toString(), rtHash);

        return { ...tokens, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
    }

    async logout(userId: string, refreshToken: string) {
        if (!userId || !refreshToken) return;
        // removing specific token implementation hard because we only have hash. 
        // Real implementation: Client sends RT, we verify it, find user, then iterate array to find match.
        // Simplified for this task: We can't easily find WHICH hash matches without iterating.

        // Let's implement finding the matching hash to remove it.
        const user = await this.usersService.findById(userId);
        if (!user) return;

        const tokens = user.refreshTokens;
        for (const rtHash of tokens) {
            const isMatch = await bcrypt.compare(refreshToken, rtHash);
            if (isMatch) {
                await this.usersService.removeRefreshToken(userId, rtHash);
                break;
            }
        }
    }

    async logoutAllDevices(userId: string) {
        if (!userId) return;
        await this.usersService.logoutUserAllDevices(userId);
    }

    async refresh(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.config.get('JWT_SECRET'),
            });
            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.refreshTokens || user.refreshTokens.length === 0) throw new ForbiddenException('Access Denied');

            let isMatch = false;
            let matchedHash = '';

            for (const rtHash of user.refreshTokens) {
                if (await bcrypt.compare(refreshToken, rtHash)) {
                    isMatch = true;
                    matchedHash = rtHash;
                    break;
                }
            }

            if (!isMatch) throw new ForbiddenException('Access Denied');

            // Rotate token: Remove old Used RT, add New RT
            await this.usersService.removeRefreshToken(user._id.toString(), matchedHash);

            const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
            const newRtHash = await bcrypt.hash(tokens.refreshToken, 10);
            await this.usersService.addRefreshToken(user._id.toString(), newRtHash);

            return tokens;
        } catch (e) {
            throw new ForbiddenException('Invalid Refresh Token');
        }
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user || user.isDeleted) throw new UnauthorizedException('User not found');

        const resetToken = randomBytes(32).toString('hex');
        const hash = await bcrypt.hash(resetToken, 10);
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1); // 1 hour expiry

        await this.usersService.update(user._id.toString(), {
            resetToken: hash, // Store hash in DB
            resetTokenExpiry: expiry,
        });

        const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:5174';
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&id=${user._id}`;

        await this.mailService.sendPasswordResetEmail(user.email, resetLink);
        return { message: 'Password reset email sent' };
    }

    async resetPassword(token: string, userId: string, newPass: string) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.resetToken || !user.resetTokenExpiry) {
            throw new BadRequestException('Invalid or expired token');
        }

        if (new Date() > user.resetTokenExpiry) {
            throw new BadRequestException('Token expired');
        }

        const isMatch = await bcrypt.compare(token, user.resetToken);
        if (!isMatch) throw new BadRequestException('Invalid token');

        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.usersService.update(userId, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
            refreshTokens: [], // Logout all devices on password reset
        });

        return { message: 'Password reset successfully' };
    }

    async getTokens(userId: string, email: string, role: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email, role },
                { secret: this.config.get('JWT_SECRET'), expiresIn: '15m' },
            ),
            this.jwtService.signAsync(
                { sub: userId, email, role },
                { secret: this.config.get('JWT_SECRET'), expiresIn: '7d' },
            ),
        ]);
        return { accessToken: at, refreshToken: rt };
    }
}

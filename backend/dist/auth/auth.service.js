"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
const mail_service_1 = require("../mail/mail.service");
const crypto_1 = require("crypto");
console.log("hi");
let AuthService = class AuthService {
    usersService;
    jwtService;
    config;
    mailService;
    constructor(usersService, jwtService, config, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.config = config;
        this.mailService = mailService;
    }
    async signup(createUserDto) {
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
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || user.isDeleted) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
        const rtHash = await bcrypt.hash(tokens.refreshToken, 10);
        await this.usersService.addRefreshToken(user._id.toString(), rtHash);
        return { ...tokens, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
    }
    async logout(userId, refreshToken) {
        if (!userId || !refreshToken)
            return;
        const user = await this.usersService.findById(userId);
        if (!user)
            return;
        const tokens = user.refreshTokens;
        for (const rtHash of tokens) {
            const isMatch = await bcrypt.compare(refreshToken, rtHash);
            if (isMatch) {
                await this.usersService.removeRefreshToken(userId, rtHash);
                break;
            }
        }
    }
    async logoutAllDevices(userId) {
        if (!userId)
            return;
        await this.usersService.logoutUserAllDevices(userId);
    }
    async refresh(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.config.get('JWT_SECRET'),
            });
            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.refreshTokens || user.refreshTokens.length === 0)
                throw new common_1.ForbiddenException('Access Denied');
            let isMatch = false;
            let matchedHash = '';
            for (const rtHash of user.refreshTokens) {
                if (await bcrypt.compare(refreshToken, rtHash)) {
                    isMatch = true;
                    matchedHash = rtHash;
                    break;
                }
            }
            if (!isMatch)
                throw new common_1.ForbiddenException('Access Denied');
            await this.usersService.removeRefreshToken(user._id.toString(), matchedHash);
            const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
            const newRtHash = await bcrypt.hash(tokens.refreshToken, 10);
            await this.usersService.addRefreshToken(user._id.toString(), newRtHash);
            return tokens;
        }
        catch (e) {
            throw new common_1.ForbiddenException('Invalid Refresh Token');
        }
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user || user.isDeleted)
            throw new common_1.UnauthorizedException('User not found');
        const resetToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const hash = await bcrypt.hash(resetToken, 10);
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);
        await this.usersService.update(user._id.toString(), {
            resetToken: hash,
            resetTokenExpiry: expiry,
        });
        const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:5174';
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&id=${user._id}`;
        await this.mailService.sendPasswordResetEmail(user.email, resetLink);
        return { message: 'Password reset email sent' };
    }
    async resetPassword(token, userId, newPass) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.resetToken || !user.resetTokenExpiry) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        if (new Date() > user.resetTokenExpiry) {
            throw new common_1.BadRequestException('Token expired');
        }
        const isMatch = await bcrypt.compare(token, user.resetToken);
        if (!isMatch)
            throw new common_1.BadRequestException('Invalid token');
        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.usersService.update(userId, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
            refreshTokens: [],
        });
        return { message: 'Password reset successfully' };
    }
    async getTokens(userId, email, role) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email, role }, { secret: this.config.get('JWT_SECRET'), expiresIn: '15m' }),
            this.jwtService.signAsync({ sub: userId, email, role }, { secret: this.config.get('JWT_SECRET'), expiresIn: '7d' }),
        ]);
        return { accessToken: at, refreshToken: rt };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
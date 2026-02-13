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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(signupDto) {
        const existingUser = await this.userModel.findOne({ email: signupDto.email });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(signupDto.password, 10);
        const createdUser = new this.userModel({
            ...signupDto,
            password: hashedPassword,
            role: user_schema_1.UserRole.USER,
        });
        return createdUser.save();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async update(id, updateData) {
        const user = await this.userModel.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async addRefreshToken(id, refreshToken) {
        await this.userModel.findByIdAndUpdate(id, {
            $push: { refreshTokens: refreshToken },
        });
    }
    async removeRefreshToken(id, refreshToken) {
        await this.userModel.findByIdAndUpdate(id, {
            $pull: { refreshTokens: refreshToken },
        });
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const users = await this.userModel.find().skip(skip).limit(limit).exec();
        const total = await this.userModel.countDocuments();
        return { data: users, total, page, limit };
    }
    async softDelete(id) {
        await this.userModel.findByIdAndUpdate(id, { isDeleted: true, refreshTokens: [] });
    }
    async restore(id) {
        await this.userModel.findByIdAndUpdate(id, { isDeleted: false });
    }
    async remove(id) {
        await this.userModel.findByIdAndDelete(id);
    }
    async logoutAll() {
        await this.userModel.updateMany({}, { refreshTokens: [] });
    }
    async logoutUserAllDevices(id) {
        await this.userModel.findByIdAndUpdate(id, { refreshTokens: [] });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './user.schema';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../auth/dto/signup.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(signupDto: SignupDto): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({ email: signupDto.email });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(signupDto.password, 10);
        const createdUser = new this.userModel({
            ...signupDto,
            password: hashedPassword,
            role: UserRole.USER,
        });
        return createdUser.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async update(id: string, updateData: Partial<User>): Promise<UserDocument> {
        const user = await this.userModel.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).exec();
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async addRefreshToken(id: string, refreshToken: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(id, {
            $push: { refreshTokens: refreshToken },
        });
    }

    async removeRefreshToken(id: string, refreshToken: string): Promise<void> {
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

    async softDelete(id: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(id, { isDeleted: true, refreshTokens: [] });
    }

    async restore(id: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(id, { isDeleted: false });
    }

    async remove(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id);
    }

    async logoutAll(): Promise<void> {
        await this.userModel.updateMany({}, { refreshTokens: [] });
    }

    async logoutUserAllDevices(id: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(id, { refreshTokens: [] });
    }
}

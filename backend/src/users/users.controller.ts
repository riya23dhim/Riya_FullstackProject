import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards, Req, UploadedFile, UseInterceptors, Post, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    getProfile(@Req() req) {
        return req.user;
    }

    @Patch('me')
    updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(req.user._id, updateUserDto);
    }

    @Delete('me')
    deleteMe(@Req() req) {
        return this.usersService.softDelete(req.user._id);
    }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    }))
    async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('File is required');
        const user = await this.usersService.update(req.user._id, { avatar: `/uploads/${file.filename}` });
        return { avatar: user.avatar };
    }

    // Admin Routes
    @Get()
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
        return this.usersService.findAll(Number(page), Number(limit));
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    softDelete(@Req() req, @Param('id') id: string) {
        if (req.user._id.toString() === id) {
            throw new BadRequestException('You cannot suspend your own account.');
        }
        return this.usersService.softDelete(id);
    }

    @Patch(':id/restore')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    restore(@Param('id') id: string) {
        return this.usersService.restore(id);
    }

    @Post('logout-all')
    async logoutAll(@Req() req) {
        await this.usersService.logoutUserAllDevices(req.user._id);
        return { message: 'Logged out from all devices successfully' };
    }
}

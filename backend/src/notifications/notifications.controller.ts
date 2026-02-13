import { Controller, Get, Patch, Param, Query, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async findAll(@Req() req, @Query('page') page = 1, @Query('limit') limit = 10) {
        return this.notificationsService.findAll(req.user._id, Number(page), Number(limit));
    }

    @Patch(':id/read')
    async markRead(@Req() req, @Param('id') id: string) {
        return this.notificationsService.markAsRead(id, req.user._id);
    }
}

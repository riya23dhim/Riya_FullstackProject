import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        private gateway: NotificationsGateway,
    ) { }

    async create(userId: string, message: string) {
        const notification = await this.notificationModel.create({
            user: userId as any,
            message,
        });
        this.gateway.sendToUser(userId.toString(), notification);
        return notification;
    }

    async findAll(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const notifications = await this.notificationModel
            .find({ user: userId as any })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.notificationModel.countDocuments({ user: userId as any });
        return { data: notifications, total, page, limit };
    }

    async markAsRead(id: string, userId: string) {
        const notification = await this.notificationModel.findOneAndUpdate(
            { _id: id, user: userId as any } as any,
            { isRead: true },
            { returnDocument: 'after' }
        ).exec();
        if (!notification) throw new NotFoundException('Notification not found');
        return notification;
    }
}

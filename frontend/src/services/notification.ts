import api from "@/config/api";
import { IResponse } from "./service";

export interface Notification {
    id: string;
    createdAt: string;
    updatedAt: string;
    message: string;
}

export interface CreateNotificationData {
    message: string;
}

// Get all notifications
export const getNotifications = async (): Promise<Notification[]> => {
    const res = (await api.get("/notifications")) as IResponse<Notification[]>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

// Get notification by ID
export const getNotification = async (id: string): Promise<Notification> => {
    const res = (await api.get(
        `/notifications/${id}`
    )) as IResponse<Notification>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

// Create new notification
export const createNotification = async (
    data: CreateNotificationData
): Promise<Notification> => {
    const res = (await api.post(
        "/notifications",
        data
    )) as IResponse<Notification>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

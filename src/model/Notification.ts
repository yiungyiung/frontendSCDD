export interface Notification {
    notificationID: number;
    userID: number;
    message: string;
    isRead: boolean;
    createdAt: Date;
    statusID: number;
  }
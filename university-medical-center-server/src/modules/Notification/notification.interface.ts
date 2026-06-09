import { NotificationType } from '../../generated/enums';

export type TNotification = {
    title: string;
    message: string;
    type: NotificationType;
    isRead?: boolean;
    userId: string;
    visitId?: string;
    prescriptionId?: string;
    medicineId?: string;
};
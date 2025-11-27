import { Reservation } from '../../../reservation/entities/reservation.entity';

export type NotificationType =
  | 'reservation_confirmation'
  | 'reservation_reminder'
  | 'reservation_cancellation'
  | 'reservation_updated'
  | 'promotion'
  | 'announcement';

export class Notification {
  id?: string;
  userId: string;
  reservationId?: string;
  reservation?: Reservation;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  pushData?: any;
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<Notification>) {
    Object.assign(this, partial);
    this.isRead = this.isRead || false;
  }

  markAsRead(): void {
    this.isRead = true;
    this.updatedAt = new Date();
  }
}

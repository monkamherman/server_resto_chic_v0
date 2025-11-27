import { Table } from './table.entity';
// Utilisation d'un type partiel pour éviter la dépendance circulaire
type User = {
  id: string;
  email: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  isActive: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

import { ReservationStatus } from './reservation-status.enum';

export class Reservation {
  id: string = '';
  userId: string = '';
  user?: User;
  tableId: string = '';
  table?: Table;
  reservationDate: Date = new Date();
  duration: number = 120; // en minutes
  partySize: number = 1;
  status: ReservationStatus = ReservationStatus.PENDING;
  specialRequests: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(partial?: Partial<Reservation>) {
    if (partial) {
      Object.assign(this, partial);
    }
    this.duration = this.duration || 120; // 2h par défaut
    this.status = this.status || ReservationStatus.PENDING;
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
  }

  isUpcoming(): boolean {
    const now = new Date();
    const endTime = new Date(this.reservationDate.getTime() + this.duration * 60000);
    return this.status === ReservationStatus.CONFIRMED && this.reservationDate > now && endTime > now;
  }

  canBeCancelled(): boolean {
    const now = new Date();
    const hoursUntilReservation = (this.reservationDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return this.status === ReservationStatus.CONFIRMED && hoursUntilReservation > 1; // Annulation possible jusqu'à 1h avant
  }
}

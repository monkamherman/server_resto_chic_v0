import { PrismaService } from "@infrastructure/persistence/prisma/prisma.service";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateReservationDto } from "../dtos/create-reservation.dto";
import { ReservationStatus } from "../entities/reservation-status.enum";
import { Reservation } from "../entities/reservation.entity";
import { Table } from "../entities/table.entity";

// Types et interfaces
type ValidLocation = 'terrasse' | 'salle' | 'bar' | 'jardin';
const VALID_LOCATIONS: ValidLocation[] = ['terrasse', 'salle', 'bar', 'jardin'];

interface NotificationService {
  sendNotification<T = unknown>(
    userId: string,
    type: string,
    data: T
  ): Promise<void>;
}

type UserData = {
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

import { TableLocation } from "../entities/table.entity";

type TableData = {
  id: string;
  number: number;
  capacity: number;
  location: TableLocation;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type ReservationWithRelations = Awaited<
  ReturnType<PrismaService["reservation"]["findUnique"]>
> & {
  table: TableData;
  user?: UserData;
};

@Injectable()
export class ReservationService {
  private readonly DEFAULT_DURATION = 120; // 2h en minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService = {
      sendNotification: async () => {
        console.warn("NotificationService non implémenté");
      },
    }
  ) {}

  // Méthodes utilitaires privées
  private createTableEntity(tableData: TableData): Table {
    return new Table({
      id: tableData.id,
      number: tableData.number,
      capacity: tableData.capacity,
      location: tableData.location,
      isActive: tableData.isActive,
      createdAt: tableData.createdAt,
      updatedAt: tableData.updatedAt,
    });
  }

  private createUserData(userData: UserData) {
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      phone: userData.phone || null,
      isActive: userData.isActive,
      role: userData.role,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
  }

  private createReservationEntity(
    reservation: ReservationWithRelations
  ): Reservation {
    if (!reservation.table) {
      throw new Error("Table non trouvée pour cette réservation");
    }

    const tableEntity = this.createTableEntity(reservation.table);

    // Création d'un objet qui contient toutes les propriétés de la réservation
    const reservationData = {
      id: reservation.id,
      userId: reservation.userId,
      tableId: reservation.tableId,
      reservationDate: reservation.reservationDate,
      // Calcul de la date de fin si elle n'est pas fournie
      reservationEnd: reservation.reservationEnd || new Date(
        new Date(reservation.reservationDate).getTime() + (reservation.duration * 60000)
      ),
      duration: reservation.duration,
      partySize: reservation.partySize,
      status: reservation.status as ReservationStatus,
      specialRequests: reservation.specialRequests || "",
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
      table: tableEntity,
    } as unknown as Reservation;

    if (reservation.user) {
      reservationData.user = this.createUserData(reservation.user);
    }

    return new Reservation(reservationData);
  }

  /**
   * Crée une nouvelle réservation
   */
  async createReservation(
    userId: string,
    dto: CreateReservationDto
  ): Promise<Reservation> {
    // Validation des entrées
    const { reservationDate, reservationEnd } =
      this.validateReservationDates(dto);
    // Vérification des tables disponibles
    const selectedTable = await this.validateAndSelectTable({
      date: reservationDate,
      duration: dto.duration || this.DEFAULT_DURATION,
      partySize: dto.partySize,
      location: dto.locationPreference as TableLocation,
    });

    if (!selectedTable?.id) {
      throw new BadRequestException("Aucune table disponible pour cette réservation");
    }

    // Création de la réservation
    const duration = Math.round(
      (reservationEnd.getTime() - reservationDate.getTime()) / 60000
    );
    const reservation = await this.prisma.reservation.create({
      data: {
        userId,
        tableId: selectedTable.id,
        reservationDate,
        reservationEnd,
        duration,
        partySize: dto.partySize,
        status: ReservationStatus.PENDING,
        specialRequests: dto.specialRequests || null,
      },
      include: {
        table: true,
        user: true,
      },
    });

    // Conversion en entité du domaine
    const reservationEntity = this.createReservationEntity(reservation);

    // Envoi de la notification
    await this.notificationService.sendNotification(
      userId,
      "reservation_created",
      {
        reservationId: reservation.id,
        date: reservation.reservationDate,
        partySize: reservation.partySize,
      }
    );

    return reservationEntity;
  }

  /**
   * Valide les dates de réservation et retourne les dates formatées
   */
  private validateReservationDates(dto: CreateReservationDto): {
    reservationDate: Date;
    reservationEnd: Date;
  } {
    // Vérifier que la date est valide
    const now = new Date();
    const reservationDate = new Date(dto.reservationDate);
    
    if (isNaN(reservationDate.getTime())) {
      throw new BadRequestException("Date de réservation invalide");
    }

    if (reservationDate < now) {
      throw new BadRequestException("La date de réservation doit être dans le futur");
    }

    const duration = dto.duration || this.DEFAULT_DURATION;
    const reservationEnd = dto.reservationEnd
      ? new Date(dto.reservationEnd)
      : new Date(reservationDate.getTime() + duration * 60000);

    if (isNaN(reservationEnd.getTime())) {
      throw new BadRequestException("Date de fin de réservation invalide");
    }

    if (reservationEnd <= reservationDate) {
      throw new BadRequestException(
        "La date de fin doit être postérieure à la date de début"
      );
    }

    // Vérifier que la durée ne dépasse pas la durée maximale (par exemple 4 heures)
    const maxDuration = 4 * 60; // 4 heures en minutes
    if (duration > maxDuration) {
      throw new BadRequestException(
        `La durée maximale de réservation est de ${maxDuration / 60} heures`
      );
    }

    return { reservationDate, reservationEnd };
  }

  /**
   * Valide et sélectionne une table disponible
   */
  private async validateAndSelectTable(params: {
    date: Date;
    duration: number;
    partySize: number;
    location?: TableLocation;
  }): Promise<Table> {
    const availableTables = await this.findAvailableTables(
      params.date,
      params.duration,
      params.partySize,
      params.location
    );

    if (availableTables.length === 0) {
      throw new ConflictException(
        "Aucune table disponible pour cette plage horaire"
      );
    }

    return availableTables[0];
  }

  /**
   * Annule une réservation existante
   */
  async cancelReservation(
    userId: string,
    reservationId: string
  ): Promise<Reservation> {
    // Récupération de la réservation
    const reservation = await this.getReservationWithRelations(
      reservationId,
      userId
    );

    // Validation de l'annulation
    this.validateCancellation(reservation);

    // Mise à jour du statut
    const updatedReservation = await this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status: ReservationStatus.CANCELLED },
      include: { table: true, user: true },
    });

    // Conversion en entité du domaine
    const reservationEntity = this.createReservationEntity(updatedReservation);

    // Envoi de la notification
    await this.notificationService.sendNotification(
      userId,
      "reservation_cancelled",
      {
        reservationId: updatedReservation.id,
        date: updatedReservation.reservationDate,
      }
    );

    return reservationEntity;
  }

  /**
   * Récupère une réservation avec ses relations
   */
  private async getReservationWithRelations(
    reservationId: string,
    userId: string
  ): Promise<ReservationWithRelations> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId, userId },
      include: { table: true, user: true },
    });

    if (!reservation) {
      throw new NotFoundException("Réservation non trouvée");
    }

    return reservation as unknown as ReservationWithRelations;
  }

  /**
   * Valide si une réservation peut être annulée
   */
  private validateCancellation(reservation: ReservationWithRelations): void {
    const now = new Date();
    const hoursUntilReservation =
      (reservation.reservationDate.getTime() - now.getTime()) /
      (1000 * 60 * 60);

    if (hoursUntilReservation < 1) {
      throw new BadRequestException(
        "Impossible d'annuler une réservation moins d'une heure avant"
      );
    }
  }

  async findAvailableTables(
    date: Date,
    duration: number,
    partySize: number,
    location?: string
  ): Promise<Table[]> {
    // Valider que la localisation est valide si fournie
    if (location && !VALID_LOCATIONS.includes(location as ValidLocation)) {
      throw new BadRequestException(
        `Localisation invalide. Doit être l'un des : ${VALID_LOCATIONS.join(', ')}`
      );
    }
    if (!date) {
      throw new BadRequestException("La date de réservation est requise");
    }

    if (duration <= 0) {
      throw new BadRequestException("La durée doit être supérieure à 0");
    }

    if (partySize <= 0) {
      throw new BadRequestException(
        "Le nombre de personnes doit être supérieur à 0"
      );
    }

    const endTime = new Date(date.getTime() + duration * 60000);

    const tables = await this.prisma.table.findMany({
      where: {
        capacity: { gte: partySize },
        isActive: true,
        ...(location ? { location } : {}),
      },
    });

    if (tables.length === 0) {
      return [];
    }

    const reservations = await this.prisma.reservation.findMany({
      where: {
        tableId: { in: tables.map((t) => t.id) },
        status: {
          in: [ReservationStatus.CONFIRMED, ReservationStatus.PENDING].map(
            (s) => s as string
          ),
        },
        OR: [
          {
            reservationDate: { lt: endTime },
            reservationEnd: { gt: date },
          },
        ],
      },
      select: {
        tableId: true,
      },
    });

    const reservedTableIds = new Set(reservations.map((r) => r.tableId));

    return tables
      .filter((table) => !reservedTableIds.has(table.id))
      .map(
        (table) =>
          new Table({
            id: table.id,
            number: table.number,
            capacity: table.capacity,
            location: table.location,
            isActive: table.isActive,
            createdAt: table.createdAt,
            updatedAt: table.updatedAt,
          })
      );
  }

  async getUserReservations(
    userId: string,
    status?: ReservationStatus
  ): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        userId,
        ...(status ? { status: status as string } : {}),
      },
      include: {
        table: true,
        user: true,
      },
      orderBy: {
        reservationDate: "asc",
      },
    });

    return reservations.map((reservation) => {
      const tableData = reservation.table as unknown as TableData;
      const tableEntity = this.createTableEntity(tableData);

      const reservationData: Partial<Reservation> = {
        id: reservation.id,
        userId: reservation.userId,
        tableId: reservation.tableId,
        reservationDate: reservation.reservationDate,
        reservationEnd: reservation.reservationEnd || new Date(
          new Date(reservation.reservationDate).getTime() + (reservation.duration * 60000)
        ),
        duration: reservation.duration,
        partySize: reservation.partySize,
        status: reservation.status as ReservationStatus,
        specialRequests: reservation.specialRequests ?? "",
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt,
        table: tableEntity,
      };

      if (reservation.user) {
        const userData = reservation.user as unknown as UserData;
        reservationData.user = {
          id: userData.id,
          email: userData.email,
          name: userData.name || null,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          phone: userData.phone || null,
          isActive: userData.isActive,
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };
      }

      return new Reservation(reservationData);
    });
  }

  async getReservationDetails(
    userId: string,
    reservationId: string
  ): Promise<Reservation> {
    const reservation = await this.prisma.reservation.findUnique({
      where: {
        id: reservationId,
        userId,
      },
      include: {
        table: true,
        user: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException("Réservation non trouvée");
    }

    return this.createReservationEntity(reservation as unknown as ReservationWithRelations);
  }

  async getReservations(
    params: {
      where?: Record<string, unknown>;
      include?: {
        user?: boolean;
        table?: boolean;
      };
      orderBy?: Record<string, "asc" | "desc">;
      skip?: number;
      take?: number;
    } = {}
  ): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      ...params,
      include: {
        ...(params.include || {}),
        table: params.include?.table !== false,
        user: params.include?.user,
      },
    });

    return reservations.map(reservation => 
      this.createReservationEntity(reservation as unknown as ReservationWithRelations)
    );
  }
}

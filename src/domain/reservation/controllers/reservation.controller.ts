import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles, UserRole } from "../../../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { AuthenticatedRequest } from "../../../core/interfaces/authenticated-request.interface";
import { CreateReservationDto } from "../dtos/create-reservation.dto";
import { ReservationStatus } from "../entities/reservation-status.enum";
import { Reservation } from "../entities/reservation.entity";
import { ReservationService } from "../services/reservation.service.js";
// Import du type TableLocation depuis l'entité Table
type TableLocation = "terrasse" | "salle" | "bar" | "jardin";

@ApiTags("reservations")
@Controller("reservations")
@ApiBearerAuth()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Créer une nouvelle réservation" })
  @ApiResponse({
    status: 201,
    description: "Réservation créée avec succès",
    type: Reservation,
  })
  @ApiResponse({ status: 400, description: "Données invalides" })
  @ApiResponse({ status: 409, description: "Aucune table disponible" })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createReservationDto: CreateReservationDto
  ): Promise<Reservation> {
    return this.reservationService.createReservation(
      req.user.id,
      createReservationDto
    );
  }

  @Get("availability")
  @ApiOperation({ summary: "Vérifier la disponibilité des tables" })
  @ApiResponse({ status: 200, description: "Liste des tables disponibles" })
  async checkAvailability(
    @Query("date") date: string,
    @Query("duration") duration: number,
    @Query("partySize") partySize: number,
    @Query("location") location?: string
  ) {
    // Valider que la localisation est valide si fournie
    const validLocations = ["terrasse", "salle", "bar", "jardin"] as const;
    if (location && !validLocations.includes(location as TableLocation)) {
      throw new BadRequestException(
        `Localisation invalide. Doit être l'un des : ${validLocations.join(", ")}`
      );
    }
    try {
      // Vérifier la disponibilité des tables
      const availableTables = await this.reservationService.findAvailableTables(
        new Date(date),
        duration ? Number(duration) : 120,
        Number(partySize),
        location as TableLocation | undefined
      );
      return availableTables;
    } catch (error) {
      throw new BadRequestException(
        "Erreur lors de la vérification de la disponibilité"
      );
    }
  }

  @Get("user/status/:status")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Obtenir les réservations d'un utilisateur par statut",
  })
  @ApiResponse({
    status: 200,
    description: "Liste des réservations de l'utilisateur",
    type: [Reservation],
  })
  async getUserReservationsByStatus(
    @Request() req: AuthenticatedRequest,
    @Param("status") status: string
  ): Promise<Reservation[]> {
    if (
      !Object.values(ReservationStatus).includes(status as ReservationStatus)
    ) {
      throw new BadRequestException("Statut de réservation invalide");
    }
    return this.reservationService.getUserReservations(
      req.user.id,
      status as ReservationStatus
    );
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Obtenir les détails d'une réservation" })
  @ApiResponse({
    status: 200,
    description: "Détails de la réservation",
    type: Reservation,
  })
  @ApiResponse({ status: 404, description: "Réservation non trouvée" })
  async getReservation(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string
  ): Promise<Reservation> {
    return this.reservationService.getReservationDetails(req.user.id, id);
  }

  @Delete(":id/cancel")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Annuler une réservation" })
  @ApiResponse({
    status: 200,
    description: "Réservation annulée avec succès",
    type: Reservation,
  })
  @ApiResponse({
    status: 400,
    description: "Impossible d'annuler cette réservation",
  })
  @ApiResponse({ status: 404, description: "Réservation non trouvée" })
  async cancelReservation(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string
  ): Promise<Reservation> {
    return this.reservationService.cancelReservation(req.user.id, id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Lister toutes les réservations (admin/staff)" })
  @ApiResponse({
    status: 200,
    description: "Liste des réservations",
    type: [Reservation],
  })
  async getAllReservations(
    @Query("status") status?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ): Promise<Reservation[]> {
    const where: {
      status?: ReservationStatus;
      reservationDate?: {
        gte: Date;
        lte: Date;
      };
    } = {};

    if (status) {
      where.status = status as ReservationStatus;
    }

    if (startDate && endDate) {
      where.reservationDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    try {
      const reservations = await this.reservationService.getReservations({
        where,
        include: {
          user: true,
          table: true,
        },
        orderBy: {
          reservationDate: "asc",
        },
      });

      return reservations;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        "Erreur lors de la récupération des réservations"
      );
    }
  }
}

import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ReservationStatus } from "../../../src/domain/reservation/entities/reservation-status.enum";
import { Reservation } from "../../../src/domain/reservation/entities/reservation.entity";
import { Table } from "../../../src/domain/reservation/entities/table.entity";
import { ReservationService } from "../../../src/domain/reservation/services/reservation.service";
import { PrismaService } from "../../../src/infrastructure/persistence/prisma/prisma.service";
import { NotificationService } from "../../../src/notification/services/notification.service";

// Mock PrismaService
const mockPrisma = {
  reservation: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
  table: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  $transaction: jest.fn((promises) => Promise.all(promises)),
};

// Mock NotificationService
const mockNotificationService = {
  sendNotification: jest.fn(),
};

describe("ReservationService", () => {
  let service: ReservationService;
  let prisma: typeof mockPrisma;
  let notificationService: typeof mockNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prisma = mockPrisma;
    notificationService = mockNotificationService;

    // Réinitialiser tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  const mockTable: Table = {
    id: "table-1",
    number: 1,
    capacity: 4,
    location: "salle",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockReservation: Reservation = {
    id: "reservation-1",
    userId: "user-1",
    tableId: "table-1",
    table: mockTable,
    reservationDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Demain
    duration: 120,
    partySize: 2,
    status: ReservationStatus.PENDING,
    specialRequests: "Près de la fenêtre",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createReservation", () => {
    it("should create a new reservation", async () => {
      const createDto = {
        tableId: "table-1",
        reservationDate: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
        duration: 120,
        partySize: 2,
        specialRequests: "Près de la fenêtre",
      };

      prisma.reservation.create.mockResolvedValue({
        ...mockReservation,
        table: mockTable,
        user: { id: "user-1", email: "test@example.com" },
      });

      prisma.table.findMany.mockResolvedValue([mockTable]);

      const result = await service.createReservation("user-1", createDto);

      expect(result).toBeDefined();
      expect(result.tableId).toBe(createDto.tableId);
      expect(prisma.reservation.create).toHaveBeenCalled();
    });

    it("should throw BadRequestException if no available tables", async () => {
      const createDto = {
        tableId: "table-1",
        reservationDate: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
        duration: 120,
        partySize: 2,
      };

      prisma.table.findMany.mockResolvedValue([]);

      await expect(
        service.createReservation("user-1", createDto)
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("cancelReservation", () => {
    it("should cancel a reservation", async () => {
      prisma.reservation.findUnique.mockResolvedValue({
        ...mockReservation,
        status: ReservationStatus.PENDING,
        table: mockTable,
        user: { id: "user-1" },
      });

      prisma.reservation.update.mockResolvedValue({
        ...mockReservation,
        status: ReservationStatus.CANCELLED,
        table: mockTable,
        user: { id: "user-1" },
      });

      const result = await service.cancelReservation("user-1", "reservation-1");

      expect(result).toBeDefined();
      expect(result.status).toBe(ReservationStatus.CANCELLED);
      expect(prisma.reservation.update).toHaveBeenCalledWith({
        where: { id: "reservation-1" },
        data: { status: ReservationStatus.CANCELLED },
        include: { table: true, user: true },
      });
    });

    it("should throw NotFoundException if reservation not found", async () => {
      prisma.reservation.findUnique.mockResolvedValue(null);

      await expect(
        service.cancelReservation("user-1", "non-existent-id")
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("getReservationDetails", () => {
    it("should return reservation details", async () => {
      prisma.reservation.findUnique.mockResolvedValue({
        ...mockReservation,
        table: mockTable,
        user: { id: "user-1", email: "test@example.com" },
      });

      const result = await service.getReservationDetails(
        "user-1",
        "reservation-1"
      );

      expect(result).toBeDefined();
      expect(result.id).toBe("reservation-1");
      expect(result.table).toBeDefined();
    });
  });

  describe("getUserReservations", () => {
    it("devrait retourner les réservations de l'utilisateur", async () => {
      prisma.reservation.findMany.mockResolvedValue([
        {
          ...mockReservation,
          table: mockTable,
          user: { id: "user-1", email: "test@example.com" },
        },
      ]);

      const result = await service.getUserReservations("user-1");

      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        include: { table: true, user: true },
        orderBy: { reservationDate: "desc" },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("reservation-1");
    });

    it("devrait filtrer par statut si fourni", async () => {
      prisma.reservation.findMany.mockResolvedValue([
        {
          ...mockReservation,
          table: mockTable,
          user: { id: "user-1", email: "test@example.com" },
        },
      ]);

      await service.getUserReservations("user-1", ReservationStatus.PENDING);

      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
          status: "PENDING",
        },
        include: { table: true, user: true },
        orderBy: { reservationDate: "desc" },
      });
    });
  });

  describe("findAvailableTables", () => {
    it("devrait retourner les tables disponibles", async () => {
      const date = new Date();
      prisma.table.findMany.mockResolvedValue([mockTable]);
      prisma.reservation.findMany.mockResolvedValue([]);

      const result = await service.findAvailableTables(date, 120, 2);

      expect(prisma.table.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("table-1");
    });

    it("devrait filtrer par localisation si fournie", async () => {
      const date = new Date();
      prisma.table.findMany.mockResolvedValue([mockTable]);
      prisma.reservation.findMany.mockResolvedValue([]);

      await service.findAvailableTables(date, 120, 2, "salle");

      expect(prisma.table.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            location: "salle",
          }),
        })
      );
    });
  });

  describe("createReservation", () => {
    it("devrait créer une réservation", async () => {
      const date = new Date();
      prisma.table.findUnique.mockResolvedValue(mockTable);
      prisma.reservation.findFirst.mockResolvedValue(null);
      prisma.reservation.create.mockResolvedValue(mockReservation);

      const result = await service.createReservation({
        userId: "user-1",
        tableId: "table-1",
        reservationDate: date,
        duration: 120,
        partySize: 2,
        specialRequests: "Près de la fenêtre",
      });

      expect(prisma.reservation.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(notificationService.sendNotification).toHaveBeenCalled();
    });

    it("devrait échouer si la table n'existe pas", async () => {
      prisma.table.findUnique.mockResolvedValue(null);

      await expect(
        service.createReservation({
          userId: "user-1",
          tableId: "table-invalide",
          reservationDate: new Date(),
          duration: 120,
          partySize: 2,
        })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("cancelReservation", () => {
    it("devrait annuler une réservation", async () => {
      prisma.reservation.findUnique.mockResolvedValue({
        ...mockReservation,
        status: ReservationStatus.CONFIRMED,
      });
      prisma.reservation.update.mockResolvedValue({
        ...mockReservation,
        status: ReservationStatus.CANCELLED,
      });

      const result = await service.cancelReservation("reservation-1", "user-1");

      expect(prisma.reservation.update).toHaveBeenCalledWith({
        where: { id: "reservation-1" },
        data: { status: ReservationStatus.CANCELLED },
      });
      expect(result.status).toBe(ReservationStatus.CANCELLED);
    });

    it("devrait échouer si la réservation n'existe pas", async () => {
      prisma.reservation.findUnique.mockResolvedValue(null);

      await expect(
        service.cancelReservation("reservation-invalide", "user-1")
      ).rejects.toThrow(NotFoundException);
    });
  });
});

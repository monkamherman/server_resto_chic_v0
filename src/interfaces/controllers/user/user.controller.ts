import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
// Custom pipe pour valider les ObjectId de MongoDB
import { UserService } from "@application/use-cases/user/user.service";
import { UserRole } from "@domain/users/enums/user-role.enum";
import { Roles } from "@infrastructure/security/decorators/roles.decorator";
import { JwtAuthGuard } from "@infrastructure/security/guards/jwt-auth.guard";
import { ParseObjectIdPipe } from "@infrastructure/security/pipes/parse-object-id.pipe";
import { CreateUserDto } from "@interfaces/controllers/user/dto/create-user.dto";
import { UpdateUserDto } from "@interfaces/controllers/user/dto/update-user.dto";
import { UserResponseDto } from "@interfaces/controllers/user/dto/user-response.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Créer un nouvel utilisateur (Admin uniquement)" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Utilisateur créé avec succès",
    type: UserResponseDto,
  })
  @ApiForbiddenResponse({ description: "Accès refusé" })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Données invalides",
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Récupérer tous les utilisateurs (Admin uniquement)",
  })
  @ApiQuery({
    name: "isActive",
    required: false,
    type: Boolean,
    description: "Filtrer par statut actif/inactif",
  })
  @ApiQuery({
    name: "role",
    required: false,
    enum: UserRole,
    description: "Filtrer par rôle utilisateur",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Liste des utilisateurs",
    type: [UserResponseDto],
  })
  @ApiForbiddenResponse({ description: "Accès refusé" })
  async findAll(
    @Query("isActive") isActive?: boolean,
    @Query("role") role?: UserRole,
  ): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll({ isActive, role });
    return users;
  }

  @Get("me")
  @ApiOperation({ summary: "Récupérer le profil de l'utilisateur connecté" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Profil utilisateur",
    type: UserResponseDto,
  })
  @ApiForbiddenResponse({ description: "Non autorisé" })
  async getProfile(
    @Request() req: { user: { userId: string } },
  ): Promise<UserResponseDto> {
    const user = await this.userService.findById(req.user.userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  }

  @Get(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Récupérer un utilisateur par son ID (Admin uniquement)",
  })
  @ApiParam({ name: "id", description: "ID de l'utilisateur" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Utilisateur trouvé",
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: "Utilisateur non trouvé" })
  async findOne(
    @Param("id", ParseObjectIdPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  }

  @Put(":id")
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({
    summary: "Mettre à jour un utilisateur",
    description:
      "Les utilisateurs ne peuvent mettre à jour que leur propre profil, les admins peuvent tout mettre à jour",
  })
  @ApiParam({ name: "id", description: "ID de l'utilisateur" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: "Utilisateur mis à jour avec succès",
    type: UserResponseDto,
  })
  @ApiForbiddenResponse({ description: "Accès refusé" })
  @ApiNotFoundResponse({ description: "Utilisateur non trouvé" })
  async update(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user: { role: UserRole; userId: string } },
  ): Promise<UserResponseDto> {
    // Un utilisateur ne peut mettre à jour que son propre profil, sauf s'il est admin
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== id) {
      throw new Error("Non autorisé");
    }

    const user = await this.userService.update(id, updateUserDto);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Supprimer un utilisateur (Admin uniquement)" })
  @ApiParam({ name: "id", description: "ID de l'utilisateur à supprimer" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Utilisateur supprimé avec succès",
  })
  @ApiNotFoundResponse({ description: "Utilisateur non trouvé" })
  @ApiForbiddenResponse({ description: "Accès refusé" })
  async remove(
    @Param("id", ParseObjectIdPipe) id: string,
  ): Promise<{ message: string }> {
    await this.userService.delete(id);
    return { message: "Utilisateur supprimé avec succès" };
  }
}

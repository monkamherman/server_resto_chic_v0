import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RolesGuard } from "./roles.guard";

@Injectable()
export class CombinedAuthGuard extends AuthGuard("jwt") {
  constructor(
    private reflector: Reflector,
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly rolesGuard: RolesGuard,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Vérifie d'abord l'authentification JWT
    const canActivateJwt = await this.jwtAuthGuard.canActivate(context);
    if (!canActivateJwt) {
      return false;
    }

    // Ensuite vérifie les rôles
    const canActivateRoles = await this.rolesGuard.canActivate(context);
    if (!canActivateRoles) {
      return false;
    }

    return true;
  }
}

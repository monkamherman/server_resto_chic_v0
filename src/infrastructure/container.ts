import { Container } from "inversify";
import { TYPES } from "../shared/constants/injection.types";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { UserService } from "../application/services/UserService";
import { UserController } from "../interfaces/controllers/UserController";

// Création du conteneur
const container = new Container();

// Enregistrement des dépendances
container.bind(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind(TYPES.UserService).to(UserService).inSingletonScope();
container.bind(TYPES.UserController).to(UserController).inSingletonScope();

export { container };

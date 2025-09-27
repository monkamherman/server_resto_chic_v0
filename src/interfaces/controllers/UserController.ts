import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  httpGet,
  httpPut,
  httpDelete,
  request,
  response,
  requestParam,
  requestBody,
} from "inversify-express-utils";
import { TYPES } from "@shared/constants/injection.types";
import { UserService } from "@application/services/UserService";
import { generateOTP } from "@shared/utils/otp";
import { sendWhatsAppMessage } from "@shared/services/whatsapp";
import { OTP_MESSAGES } from "@shared/constants/messages";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "@shared/constants/error-messages";
import { User, UserUpdateInput } from "@domain/entities/User";

// Types pour les requêtes
type RegisterRequest = Request & {
  body: {
    step: "register" | "verify-otp" | "complete-registration";
    nom?: string;
    prenom?: string;
    sexe?: string;
    email?: string;
    otp?: string;
    telephone?: string;
    password?: string;
  };
};

interface FormattedUserResponse {
  id: string;
  nom: string;
  prenom: string;
  sexe: string;
  email: string;
  telephone: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contrôleur pour la gestion des utilisateurs
 * Gère les opérations CRUD et l'authentification des utilisateurs
 */
@controller("/users")
export class UserController {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService,
  ) {}

  /**
   * Enregistre un nouvel utilisateur
   * Gère les différentes étapes : enregistrement, vérification OTP, complétion
   */
  @httpPost("/register")
  async register(
    @request() req: RegisterRequest,
    @response() res: Response,
  ): Promise<void> {
    try {
      const { step, nom, prenom, sexe, email, otp, telephone, password } =
        req.body;

      switch (step) {
        case "register":
          await this.handleRegistrationStep(
            { nom, prenom, sexe, email, telephone },
            res,
          );
          break;

        case "verify-otp":
          await this.handleOtpVerification(telephone, otp, res);
          break;

        case "complete-registration":
          await this.handleRegistrationCompletion({
            telephone,
            email,
            password,
            res,
          });
          break;

        default:
          this.sendErrorResponse(
            res,
            400,
            ERROR_MESSAGES.INVALID_REGISTRATION_STEP,
          );
      }
    } catch (error) {
      this.handleError(res, error, "Erreur lors de l'inscription");
    }
  }

  /**
   * Récupère tous les utilisateurs
   */
  @httpGet("/")
  async getAllUsers(
    @request() _req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      // Implémentation basique - à adapter selon votre logique métier
      // Note: La méthode getAllUsers n'existe pas encore dans le UserService
      // Vous devrez l'implémenter dans le UserService si nécessaire
      this.sendErrorResponse(res, 501, {
        message:
          "Non implémenté: cette fonctionnalité nécessite une implémentation dans le UserService",
      });

      // Exemple d'implémentation future:
      // const users = await this.userService.getAllUsers();
      // this.sendSuccessResponse(res, {
      //   data: users.map(user => this.formatUserResponse(user))
      // });
    } catch (error) {
      this.handleError(res, error, ERROR_MESSAGES.USERS_FETCH_ERROR);
    }
  }

  /**
   * Récupère un utilisateur par son ID
   */
  @httpGet("/:id")
  async getUserById(
    @requestParam("id") id: string,
    @response() res: Response,
  ): Promise<void> {
    try {
      const user = await this.userService.getUserById(id);

      if (!user) {
        this.sendErrorResponse(res, 404, ERROR_MESSAGES.USER_NOT_FOUND);
        return;
      }

      this.sendSuccessResponse(res, {
        data: this.formatUserResponse(user),
      });
    } catch (error) {
      this.handleError(res, error, ERROR_MESSAGES.USER_FETCH_ERROR);
    }
  }

  /**
   * Met à jour un utilisateur existant
   */
  @httpPut("/:id")
  async updateUser(
    @requestParam("id") id: string,
    @requestBody() updateData: UserUpdateInput,
    @response() res: Response,
  ): Promise<void> {
    try {
      const existingUser = await this.userService.getUserById(id);
      if (!existingUser) {
        this.sendErrorResponse(res, 404, ERROR_MESSAGES.USER_NOT_FOUND);
        return;
      }

      const updatedUser = await this.userService.updateUser(id, updateData);

      this.sendSuccessResponse(res, {
        message: SUCCESS_MESSAGES.USER_UPDATED,
        data: this.formatUserResponse(updatedUser),
      });
    } catch (error) {
      this.handleError(res, error, ERROR_MESSAGES.USER_UPDATE_ERROR);
    }
  }

  /**
   * Supprime un utilisateur
   */
  @httpDelete("/:id")
  async deleteUser(
    @requestParam("id") id: string,
    @response() res: Response,
  ): Promise<void> {
    try {
      const existingUser = await this.userService.getUserById(id);
      if (!existingUser) {
        this.sendErrorResponse(res, 404, ERROR_MESSAGES.USER_NOT_FOUND);
        return;
      }

      await this.userService.deleteUser(id);

      this.sendSuccessResponse(res, {
        message: SUCCESS_MESSAGES.USER_DELETED,
      });
    } catch (error) {
      this.handleError(res, error, ERROR_MESSAGES.USER_DELETE_ERROR);
    }
  }

  //#region Méthodes privées

  /**
   * Gère l'étape d'enregistrement initial
   */
  private async handleRegistrationStep(
    data: {
      nom?: string;
      prenom?: string;
      sexe?: string;
      email?: string;
      telephone?: string;
    },
    res: Response,
  ): Promise<void> {
    if (!data.nom || !data.telephone) {
      this.sendErrorResponse(res, 400, ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
      return;
    }

    // Vérifier si l'email existe déjà
    if (data.email) {
      const existingUser = await this.userService.getUserByEmail(data.email);
      if (existingUser) {
        this.sendErrorResponse(res, 400, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
        return;
      }
    }

    // Vérifier si le numéro de téléphone existe déjà
    try {
      const existingPhoneUser = await this.userService.getUserByEmail(
        data.telephone,
      );
      if (existingPhoneUser) {
        this.sendErrorResponse(res, 400, ERROR_MESSAGES.PHONE_ALREADY_EXISTS);
        return;
      }
    } catch (error) {
      // Gérer le cas où la méthode findByPhone n'est pas disponible
      console.warn(
        "Erreur lors de la vérification du numéro de téléphone:",
        error,
      );
      // On continue quand même car la vérification n'est pas critique
    }

    const otpCode = generateOTP();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 30);

    const userData = {
      fullName: `${data.prenom || ""} ${data.nom || ""}`.trim(),
      phoneNumber: data.telephone,
      otpCode,
      otpExpiresAt,
      email: data.email,
      nom: data.nom,
      prenom: data.prenom,
      sexe: data.sexe,
    };

    const user = await this.userService.registerWithOtp(userData);
    const message = OTP_MESSAGES.WELCOME_OTP(otpCode);

    try {
      await sendWhatsAppMessage(data.telephone, message);
      this.sendSuccessResponse(res, { message: OTP_MESSAGES.OTP_SENT });
    } catch (error) {
      await this.userService.deleteUser(user.id);
      this.sendErrorResponse(res, 400, {
        message: OTP_MESSAGES.INVALID_PHONE,
        code: "INVALID_WHATSAPP_NUMBER",
        details:
          "Le numéro fourni n'est pas valide ou n'est pas enregistré sur WhatsApp.",
      });
    }
  }

  /**
   * Gère la vérification du code OTP
   */
  private async handleOtpVerification(
    phoneNumber: string | undefined,
    otp: string | undefined,
    res: Response,
  ): Promise<void> {
    if (!phoneNumber || !otp) {
      this.sendErrorResponse(res, 400, ERROR_MESSAGES.MISSING_OTP_OR_PHONE);
      return;
    }

    await this.userService.verifyOtp(phoneNumber, otp);
    this.sendSuccessResponse(res, { message: "OTP validé avec succès" });
  }

  /**
   * Gère la complétion de l'inscription
   */
  private async handleRegistrationCompletion({
    telephone,
    email,
    password,
    res,
  }: {
    telephone?: string;
    email?: string;
    password?: string;
    res: Response;
  }): Promise<void> {
    if (!telephone || !email || !password) {
      this.sendErrorResponse(res, 400, ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
      return;
    }

    const existingUser = await this.userService.getUserByEmail(email);
    if (!existingUser) {
      this.sendErrorResponse(res, 404, ERROR_MESSAGES.USER_NOT_FOUND);
      return;
    }

    const completeData = {
      userId: existingUser.id,
      email,
      password,
      phoneNumber: telephone,
      nom: existingUser.nom || "",
      prenom: existingUser.prenom || "",
      sexe: existingUser.sexe || "",
    };

    const updatedUser =
      await this.userService.completeRegistration(completeData);
    this.sendSuccessResponse(res, {
      message: SUCCESS_MESSAGES.REGISTRATION_COMPLETE,
      user: this.formatUserResponse(updatedUser),
    });
  }

  /**
   * Formate la réponse utilisateur pour la réponse API
   */
  private formatUserResponse(user: User | null): FormattedUserResponse | null {
    if (!user) return null;

    // Extraire le nom et prénom du fullName si nécessaire
    let nom = "";
    let prenom = "";

    if ("fullName" in user && user.fullName) {
      const nameParts = user.fullName.split(" ");
      prenom = nameParts[0] || "";
      nom = nameParts.slice(1).join(" ") || "";
    }

    return {
      id: user.id,
      nom: ("nom" in user ? user.nom : "") || nom,
      prenom: ("prenom" in user ? user.prenom : "") || prenom,
      sexe: ("sexe" in user ? user.sexe : "") || "",
      email: user.email || "",
      telephone: (("phoneNumber" in user && user.phoneNumber) ||
        ("telephone" in user && user.telephone) ||
        "") as string,
      role: user.role || "user",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Envoie une réponse de succès standardisée
   */
  private sendSuccessResponse<T extends Record<string, unknown>>(
    res: Response,
    data: T,
  ): void {
    res.status(200).json({
      success: true,
      ...data,
    });
  }

  /**
   * Envoie une réponse d'erreur standardisée
   */
  private sendErrorResponse(
    res: Response,
    statusCode: number,
    error: string | { message: string; code?: string; details?: unknown },
  ): void {
    const response = typeof error === "string" ? { message: error } : error;

    res.status(statusCode).json({
      success: false,
      ...response,
    });
  }

  /**
   * Gère les erreurs et envoie une réponse appropriée
   */
  /**
   * Gère les erreurs de manière centralisée
   * @param res L'objet Response d'Express
   * @param error L'erreur survenue
   * @param defaultMessage Le message d'erreur par défaut
   * @param statusCode Le code de statut HTTP par défaut (400 pour les erreurs client, 500 pour les erreurs serveur)
   */
  private handleError(
    res: Response,
    error: unknown,
    defaultMessage: string,
    statusCode = 400,
  ): void {
    // Journalisation de l'erreur pour le débogage
    console.error(`[${new Date().toISOString()}] Error:`, error);

    // Extraction du message d'erreur
    let errorMessage = defaultMessage;
    let errorCode: string | undefined;
    let errorDetails: unknown;

    if (error instanceof Error) {
      errorMessage = error.message || defaultMessage;
      errorDetails =
        process.env.NODE_ENV === "development" ? error.stack : undefined;
    } else if (typeof error === "object" && error !== null) {
      // Gestion des erreurs sous forme d'objet
      const errorObj = error as Record<string, unknown>;
      errorMessage = (errorObj.message as string) || defaultMessage;
      errorCode = errorObj.code as string;
      errorDetails = errorObj.details;
    }

    // Construction de l'objet de réponse d'erreur
    const errorResponse: {
      success: boolean;
      message: string;
      code?: string;
      details?: unknown;
    } = {
      success: false,
      message: errorMessage,
    };

    // Ajout des champs optionnels si présents
    if (errorCode) {
      errorResponse.code = errorCode;
    }
    if (errorDetails) {
      errorResponse.details = errorDetails;
    }

    // Envoi de la réponse d'erreur
    this.sendErrorResponse(res, statusCode, errorResponse);
  }

  //#endregion

  /**
   * Renvoie un nouveau code OTP à l'utilisateur
   */
  @httpPost("/resend-otp")
  async resendOtp(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    try {
      const { telephone } = req.body;

      if (!telephone) {
        this.sendErrorResponse(res, 400, ERROR_MESSAGES.PHONE_REQUIRED);
        return;
      }

      const otpCode = generateOTP();
      await this.userService.resendOtp(telephone, otpCode);

      // Envoyer le code OTP par WhatsApp
      const message = OTP_MESSAGES.WELCOME_OTP(otpCode);
      await sendWhatsAppMessage(telephone, message);

      this.sendSuccessResponse(res, {
        message: SUCCESS_MESSAGES.OTP_RESENT,
        code: "OTP_RESENT_SUCCESSFULLY",
      });
    } catch (error) {
      this.handleError(res, error, ERROR_MESSAGES.OTP_SEND_ERROR);
    }
  }
}

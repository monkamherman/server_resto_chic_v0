"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const user_role_enum_1 = require("../users/enums/user-role.enum");
class User {
    id;
    fullName;
    nom;
    prenom;
    sexe;
    phoneNumber;
    email;
    password;
    otpCode;
    otpExpiresAt;
    otpVerified;
    otpSentAt;
    isActive;
    role;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
    // Méthodes du domaine
    isAdmin() {
        return this.role === user_role_enum_1.UserRole.ADMIN;
    }
    verifyOtp(code) {
        if (!this.otpCode || this.otpCode !== code) {
            return false;
        }
        if (this.otpExpiresAt && this.otpExpiresAt < new Date()) {
            return false;
        }
        this.otpVerified = true;
        this.otpCode = undefined;
        this.otpExpiresAt = undefined;
        return true;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map
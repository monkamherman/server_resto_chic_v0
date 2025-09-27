"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemainingOtpTime = exports.isOtpExpired = exports.generateOTP = void 0;
/**
 * Génère un code OTP à 6 chiffres
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
exports.generateOTP = generateOTP;
/**
 * Vérifie si un OTP est expiré
 */
function isOtpExpired(expiryDate) {
    if (!expiryDate)
        return true;
    return new Date() > new Date(expiryDate);
}
exports.isOtpExpired = isOtpExpired;
/**
 * Calcule le temps restant avant l'expiration d'un OTP (en secondes)
 */
function getRemainingOtpTime(expiryDate) {
    if (!expiryDate)
        return 0;
    const now = new Date();
    const expiry = new Date(expiryDate);
    return Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / 1000));
}
exports.getRemainingOtpTime = getRemainingOtpTime;
//# sourceMappingURL=otp.js.map
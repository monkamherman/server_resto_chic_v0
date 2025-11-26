"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.isOtpExpired = isOtpExpired;
exports.getRemainingOtpTime = getRemainingOtpTime;
/**
 * Génère un code OTP à 6 chiffres
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
/**
 * Vérifie si un OTP est expiré
 */
function isOtpExpired(expiryDate) {
    if (!expiryDate)
        return true;
    return new Date() > new Date(expiryDate);
}
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
//# sourceMappingURL=otp.js.map
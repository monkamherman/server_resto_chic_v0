/**
 * Génère un code OTP à 6 chiffres
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Vérifie si un OTP est expiré
 */
export function isOtpExpired(expiryDate: Date | null | undefined): boolean {
  if (!expiryDate) return true;
  return new Date() > new Date(expiryDate);
}

/**
 * Calcule le temps restant avant l'expiration d'un OTP (en secondes)
 */
export function getRemainingOtpTime(
  expiryDate: Date | null | undefined,
): number {
  if (!expiryDate) return 0;
  const now = new Date();
  const expiry = new Date(expiryDate);
  return Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / 1000));
}

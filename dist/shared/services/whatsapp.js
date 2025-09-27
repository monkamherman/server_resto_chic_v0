"use strict";
/**
 * Service d'envoi de messages WhatsApp
 * À remplacer par une implémentation réelle avec l'API WhatsApp Business
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWhatsAppNumber = exports.sendWhatsAppMessage = void 0;
/**
 * Envoie un message WhatsApp
 */
async function sendWhatsAppMessage(phoneNumber, message) {
    try {
        // Vérification basique du numéro de téléphone
        if (!phoneNumber || !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
            throw new Error("Numéro de téléphone invalide");
        }
        // Ici, vous intégrerez l'API WhatsApp Business ou un service tiers
        // Par exemple, avec Twilio ou un autre fournisseur de services WhatsApp
        // Simulation d'envoi réussi
        console.log(`[WhatsApp] Envoi à ${phoneNumber}: ${message.substring(0, 50)}...`);
        return {
            success: true,
            messageId: `wa-${Date.now()}`,
        };
    }
    catch (error) {
        console.error("Erreur lors de l'envoi du message WhatsApp:", error);
        // Gestion des erreurs spécifiques
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("invalid phone number")) {
            throw {
                code: "INVALID_PHONE_NUMBER",
                message: "Numéro de téléphone invalide",
            };
        }
        if (errorMessage.includes("not registered")) {
            throw {
                code: "INVALID_JID",
                message: "Le numéro n'est pas enregistré sur WhatsApp",
            };
        }
        // Erreur générique
        throw {
            code: "WHATSAPP_SEND_ERROR",
            message: "Erreur lors de l'envoi du message WhatsApp",
        };
    }
}
exports.sendWhatsAppMessage = sendWhatsAppMessage;
/**
 * Vérifie si un numéro est valide pour WhatsApp
 */
async function validateWhatsAppNumber(phoneNumber) {
    try {
        // Ici, vous pourriez appeler une API pour vérifier le numéro
        // Pour l'exemple, on suppose que le numéro est valide s'il commence par "+" et a au moins 10 chiffres
        return /^\+[1-9]\d{9,14}$/.test(phoneNumber);
    }
    catch (error) {
        console.error("Erreur lors de la validation du numéro WhatsApp:", error);
        return false;
    }
}
exports.validateWhatsAppNumber = validateWhatsAppNumber;
//# sourceMappingURL=whatsapp.js.map
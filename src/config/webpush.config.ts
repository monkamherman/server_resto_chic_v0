export const webpushConfig = {
  // Ces clés doivent être générées et stockées de manière sécurisée
  // Utilisez: webpush.generateVAPIDKeys()
  publicKey: process.env.VAPID_PUBLIC_KEY || 'VOTRE_CLE_PUBLIQUE',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'VOTRE_CLE_PRIVEE',
  subject: process.env.VAPID_SUBJECT || 'mailto:contact@votreresto.com',
};

export const notificationTemplates = {
  reservation_confirmation: {
    title: 'Réservation confirmée !',
    message: (reservation: any) => 
      `Votre réservation pour ${reservation.partySize} personnes le ${new Date(reservation.reservationDate).toLocaleString('fr-FR')} est confirmée.`,
    options: {
      requireInteraction: true,
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
    },
  },
  reminder: {
    title: 'Rappel de réservation',
    message: () => 'N\'oubliez pas votre réservation aujourd\'hui !',
    options: {
      requireInteraction: true,
      icon: '/assets/icons/icon-192x192.png',
    },
  },
  // Ajoutez d'autres modèles de notifications au besoin
};

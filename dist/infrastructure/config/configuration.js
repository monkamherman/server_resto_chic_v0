"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    // Configuration de la base de données
    database: {
        url: process.env.DATABASE_URL || "mongodb://localhost:27017",
        name: process.env.DATABASE_NAME || "nest_template",
        host: process.env.DATABASE_HOST || "localhost",
        port: parseInt(process.env.DATABASE_PORT || "27017", 10),
        username: process.env.DATABASE_USERNAME || "",
        password: process.env.DATABASE_PASSWORD || "",
    },
    // Configuration JWT
    jwt: {
        secret: process.env.JWT_SECRET || "votre_secret_tres_securise",
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        refreshSecret: process.env.JWT_REFRESH_SECRET || "votre_refresh_secret_tres_securise",
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
    // Configuration du taux de limitation
    throttler: {
        ttl: parseInt(process.env.THROTTLER_TTL || "60000", 10),
        limit: parseInt(process.env.THROTTLER_LIMIT || "10", 10),
    },
});
//# sourceMappingURL=configuration.js.map
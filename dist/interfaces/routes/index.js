"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_routes_1 = require("./api.routes");
const router = (0, express_1.Router)();
// Route de santé
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
// Routes d'API
router.use('/api', (0, api_routes_1.setupApiRoutes)());
exports.default = router;
//# sourceMappingURL=index.js.map
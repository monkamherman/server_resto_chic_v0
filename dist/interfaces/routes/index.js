"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const router = (0, express_1.Router)();
// Route de santé
router.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});
// Routes d'API
router.use("/api/users", user_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map
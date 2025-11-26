"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerRoutes;
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const route_1 = __importDefault(require("./route"));
const app = (0, express_1.default)();
function registerRoutes(app) {
    app.use("/api/user", route_1.default);
    app.use("/api/auth", auth_routes_1.default);
}
//# sourceMappingURL=index.js.map
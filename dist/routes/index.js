"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = __importDefault(require("./route"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const participants_routes_1 = __importDefault(require("./participants.routes"));
const formations_routes_1 = __importDefault(require("./formations.routes"));
const formateurs_routes_1 = __importDefault(require("./formateurs.routes"));
const dispenses_routes_1 = __importDefault(require("./dispenses.routes"));
const inscriptions_routes_1 = __importDefault(require("./inscriptions.routes"));
const parlements_routes_1 = __importDefault(require("./parlements.routes"));
const app = (0, express_1.default)();
function registerRoutes(app) {
    app.use('/api/user', route_1.default);
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/participants', participants_routes_1.default);
    app.use('/api/formations', formations_routes_1.default);
    app.use('/api/formateurs', formateurs_routes_1.default);
    app.use('/api/dispenses', dispenses_routes_1.default);
    app.use('/api/inscriptions', inscriptions_routes_1.default);
    app.use('/api/parlements', parlements_routes_1.default);
}
exports.default = registerRoutes;
//# sourceMappingURL=index.js.map
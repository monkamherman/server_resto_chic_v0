"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const participants_controller_1 = __importDefault(require("../controllers/participants.controller"));
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const router = (0, express_1.Router)();
router.post('/', requireAuth_1.default, participants_controller_1.default.create);
router.get('/', requireAuth_1.default, participants_controller_1.default.list);
router.get('/:id', requireAuth_1.default, participants_controller_1.default.getById);
exports.default = router;
//# sourceMappingURL=participants.routes.js.map
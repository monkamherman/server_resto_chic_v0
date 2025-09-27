"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipesModule = void 0;
const common_1 = require("@nestjs/common");
const parse_object_id_pipe_1 = require("./parse-object-id.pipe");
let PipesModule = class PipesModule {
};
exports.PipesModule = PipesModule;
exports.PipesModule = PipesModule = __decorate([
    (0, common_1.Module)({
        providers: [parse_object_id_pipe_1.ParseObjectIdPipe],
        exports: [parse_object_id_pipe_1.ParseObjectIdPipe],
    })
], PipesModule);
//# sourceMappingURL=pipes.module.js.map
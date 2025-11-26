"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishControllersModule = void 0;
const common_1 = require("@nestjs/common");
const dish_module_1 = require("../../../../domain/dish/dish.module");
const dish_controller_1 = require("./dish.controller");
const create_dish_controller_1 = require("./create-dish.controller");
const get_dish_controller_1 = require("./get-dish.controller");
const update_dish_controller_1 = require("./update-dish.controller");
const delete_dish_controller_1 = require("./delete-dish.controller");
let DishControllersModule = class DishControllersModule {
};
exports.DishControllersModule = DishControllersModule;
exports.DishControllersModule = DishControllersModule = __decorate([
    (0, common_1.Module)({
        imports: [dish_module_1.DishModule],
        controllers: [
            dish_controller_1.DishController,
            create_dish_controller_1.CreateDishController,
            get_dish_controller_1.GetDishController,
            update_dish_controller_1.UpdateDishController,
            delete_dish_controller_1.DeleteDishController,
        ],
    })
], DishControllersModule);
//# sourceMappingURL=dish-controllers.module.js.map
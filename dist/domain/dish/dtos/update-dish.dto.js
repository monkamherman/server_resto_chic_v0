"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDishDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_dish_dto_1 = require("./create-dish.dto");
class UpdateDishDto extends (0, swagger_1.PartialType)(create_dish_dto_1.CreateDishDto) {
}
exports.UpdateDishDto = UpdateDishDto;
//# sourceMappingURL=update-dish.dto.js.map
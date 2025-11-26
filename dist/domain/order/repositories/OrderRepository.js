"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
class OrderRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.order.create({ data });
    }
    async findById(id) {
        return this.prisma.order.findUnique({ where: { id } });
    }
    async update(id, data) {
        return this.prisma.order.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        try {
            await this.prisma.order.delete({ where: { id } });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async findAll() {
        return this.prisma.order.findMany();
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=OrderRepository.js.map
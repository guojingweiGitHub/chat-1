"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesController = void 0;
const common_1 = require("@nestjs/common");
const fees_service_1 = require("./fees.service");
const fee_dto_1 = require("./dto/fee.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/guards/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let FeesController = class FeesController {
    feesService;
    constructor(feesService) {
        this.feesService = feesService;
    }
    async findAllCycles(query) {
        return this.feesService.findAllCycles(query);
    }
    async findOneCycle(id) {
        return this.feesService.findOneCycle(id);
    }
    async createCycle(dto) {
        return this.feesService.createCycle(dto);
    }
    async updateCycle(id, dto) {
        return this.feesService.updateCycle(id, dto);
    }
    async removeCycle(id) {
        return this.feesService.removeCycle(id);
    }
    async findAllPayments(query) {
        return this.feesService.findAllPayments(query);
    }
    async getExpiringPayments(days) {
        return this.feesService.getExpiringPayments(days || 30);
    }
    async getOverduePayments() {
        return this.feesService.getOverduePayments();
    }
    async findOnePayment(id) {
        return this.feesService.findOnePayment(id);
    }
    async createPayment(dto, userId) {
        return this.feesService.createPayment(dto, userId);
    }
    async updatePayment(id, dto) {
        return this.feesService.updatePayment(id, dto);
    }
    async removePayment(id) {
        return this.feesService.removePayment(id);
    }
};
exports.FeesController = FeesController;
__decorate([
    (0, common_1.Get)('cycles'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fee_dto_1.QueryFeeCycleDto]),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "findAllCycles", null);
__decorate([
    (0, common_1.Get)('cycles/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "findOneCycle", null);
__decorate([
    (0, common_1.Post)('cycles'),
    (0, roles_decorator_1.Roles)('admin', 'campus_manager'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fee_dto_1.CreateFeeCycleDto]),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "createCycle", null);
__decorate([
    (0, common_1.Put)('cycles/:id'),
    (0, roles_decorator_1.Roles)('admin', 'campus_manager'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, fee_dto_1.UpdateFeeCycleDto]),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "updateCycle", null);
__decorate([
    (0, common_1.Delete)('cycles/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "removeCycle", null);
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fee_dto_1.QueryPaymentDto]),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "findAllPayments", null);
__decorate([
    (0, common_1.Get)('payments/expiring'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "getExpiringPayments", null);
__decorate([
    (0, common_1.Get)('payments/overdue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "getOverduePayments", null);
__decorate([
    (0, common_1.Get)('payments/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "findOnePayment", null);
__decorate([
    (0, common_1.Post)('payments'),
    (0, roles_decorator_1.Roles)('admin', 'campus_manager', 'receptionist'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fee_dto_1.CreatePaymentDto, Number]),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Put)('payments/:id'),
    (0, roles_decorator_1.Roles)('admin', 'campus_manager', 'receptionist'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, fee_dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "updatePayment", null);
__decorate([
    (0, common_1.Delete)('payments/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeesController.prototype, "removePayment", null);
exports.FeesController = FeesController = __decorate([
    (0, common_1.Controller)('fees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [fees_service_1.FeesService])
], FeesController);
//# sourceMappingURL=fees.controller.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeCycle = void 0;
const typeorm_1 = require("typeorm");
const campus_entity_1 = require("../campuses/campus.entity");
let FeeCycle = class FeeCycle {
    id;
    name;
    type;
    startDate;
    endDate;
    standardFee;
    campusId;
    campus;
    createdAt;
};
exports.FeeCycle = FeeCycle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FeeCycle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], FeeCycle.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], FeeCycle.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], FeeCycle.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], FeeCycle.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], FeeCycle.prototype, "standardFee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], FeeCycle.prototype, "campusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => campus_entity_1.Campus),
    (0, typeorm_1.JoinColumn)({ name: 'campusId' }),
    __metadata("design:type", campus_entity_1.Campus)
], FeeCycle.prototype, "campus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FeeCycle.prototype, "createdAt", void 0);
exports.FeeCycle = FeeCycle = __decorate([
    (0, typeorm_1.Entity)('fee_cycles')
], FeeCycle);
//# sourceMappingURL=fee-cycle.entity.js.map
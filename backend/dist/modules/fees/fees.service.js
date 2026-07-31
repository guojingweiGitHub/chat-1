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
exports.FeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fee_cycle_entity_1 = require("./fee-cycle.entity");
const payment_entity_1 = require("./payment.entity");
let FeesService = class FeesService {
    feeCyclesRepository;
    paymentsRepository;
    constructor(feeCyclesRepository, paymentsRepository) {
        this.feeCyclesRepository = feeCyclesRepository;
        this.paymentsRepository = paymentsRepository;
    }
    async findAllCycles(query) {
        const { keyword, type, campusId, page = 1, pageSize = 10 } = query;
        const qb = this.feeCyclesRepository.createQueryBuilder('cycle')
            .leftJoinAndSelect('cycle.campus', 'campus');
        if (keyword) {
            qb.andWhere('cycle.name LIKE :kw', { kw: `%${keyword}%` });
        }
        if (type) {
            qb.andWhere('cycle.type = :type', { type });
        }
        if (campusId) {
            qb.andWhere('cycle.campusId = :campusId', { campusId });
        }
        const total = await qb.getCount();
        const items = await qb
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('cycle.createdAt', 'DESC')
            .getMany();
        return { items, total, page, pageSize };
    }
    async findOneCycle(id) {
        const cycle = await this.feeCyclesRepository.findOne({
            where: { id },
            relations: { campus: true },
        });
        if (!cycle) {
            throw new common_1.NotFoundException('收费周期不存在');
        }
        return cycle;
    }
    async createCycle(dto) {
        const cycle = this.feeCyclesRepository.create(dto);
        return this.feeCyclesRepository.save(cycle);
    }
    async updateCycle(id, dto) {
        const cycle = await this.findOneCycle(id);
        Object.assign(cycle, dto);
        return this.feeCyclesRepository.save(cycle);
    }
    async removeCycle(id) {
        const cycle = await this.findOneCycle(id);
        await this.feeCyclesRepository.remove(cycle);
        return { message: '删除成功' };
    }
    async findAllPayments(query) {
        const { keyword, campusId, cycleId, status, page = 1, pageSize = 10 } = query;
        const qb = this.paymentsRepository.createQueryBuilder('payment')
            .leftJoinAndSelect('payment.student', 'student')
            .leftJoinAndSelect('payment.cycle', 'cycle')
            .leftJoinAndSelect('payment.campus', 'campus');
        if (keyword) {
            qb.andWhere('(student.name LIKE :kw OR student.phone LIKE :kw)', { kw: `%${keyword}%` });
        }
        if (campusId) {
            qb.andWhere('payment.campusId = :campusId', { campusId });
        }
        if (cycleId) {
            qb.andWhere('payment.cycleId = :cycleId', { cycleId });
        }
        if (status) {
            qb.andWhere('payment.status = :status', { status });
        }
        const total = await qb.getCount();
        const items = await qb
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('payment.createdAt', 'DESC')
            .getMany();
        return { items, total, page, pageSize };
    }
    async findOnePayment(id) {
        const payment = await this.paymentsRepository.findOne({
            where: { id },
            relations: { student: true, cycle: true, campus: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException('缴费记录不存在');
        }
        return payment;
    }
    async createPayment(dto, operatorId) {
        const payment = this.paymentsRepository.create({
            ...dto,
            operatorId,
        });
        return this.paymentsRepository.save(payment);
    }
    async updatePayment(id, dto) {
        const payment = await this.findOnePayment(id);
        Object.assign(payment, dto);
        return this.paymentsRepository.save(payment);
    }
    async removePayment(id) {
        const payment = await this.findOnePayment(id);
        await this.paymentsRepository.remove(payment);
        return { message: '删除成功' };
    }
    async getExpiringPayments(days = 30) {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + days);
        return this.paymentsRepository.find({
            where: {
                status: 'unpaid',
                dueDate: (0, typeorm_2.Between)(now, futureDate),
            },
            relations: { student: true, cycle: true, campus: true },
            order: { dueDate: 'ASC' },
        });
    }
    async getOverduePayments() {
        const now = new Date();
        return this.paymentsRepository.find({
            where: {
                status: 'unpaid',
                dueDate: (0, typeorm_2.LessThanOrEqual)(now),
            },
            relations: { student: true, cycle: true, campus: true },
            order: { dueDate: 'ASC' },
        });
    }
};
exports.FeesService = FeesService;
exports.FeesService = FeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fee_cycle_entity_1.FeeCycle)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FeesService);
//# sourceMappingURL=fees.service.js.map
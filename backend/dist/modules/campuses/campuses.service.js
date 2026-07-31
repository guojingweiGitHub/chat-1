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
exports.CampusesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const campus_entity_1 = require("./campus.entity");
let CampusesService = class CampusesService {
    campusesRepository;
    constructor(campusesRepository) {
        this.campusesRepository = campusesRepository;
    }
    async findAll(query) {
        const { keyword, status, page = 1, pageSize = 10 } = query;
        const qb = this.campusesRepository.createQueryBuilder('campus');
        if (keyword) {
            qb.andWhere('(campus.name LIKE :kw OR campus.address LIKE :kw OR campus.phone LIKE :kw)', { kw: `%${keyword}%` });
        }
        if (status) {
            qb.andWhere('campus.status = :status', { status });
        }
        const total = await qb.getCount();
        const items = await qb
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('campus.createdAt', 'DESC')
            .getMany();
        return { items, total, page, pageSize };
    }
    async findAllActive() {
        return this.campusesRepository.find({ where: { status: 'active' } });
    }
    async findOne(id) {
        const campus = await this.campusesRepository.findOne({ where: { id } });
        if (!campus) {
            throw new common_1.NotFoundException('校区不存在');
        }
        return campus;
    }
    async create(dto) {
        const campus = this.campusesRepository.create(dto);
        return this.campusesRepository.save(campus);
    }
    async update(id, dto) {
        const campus = await this.findOne(id);
        Object.assign(campus, dto);
        return this.campusesRepository.save(campus);
    }
    async remove(id) {
        const campus = await this.findOne(id);
        await this.campusesRepository.remove(campus);
        return { message: '删除成功' };
    }
};
exports.CampusesService = CampusesService;
exports.CampusesService = CampusesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(campus_entity_1.Campus)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CampusesService);
//# sourceMappingURL=campuses.service.js.map
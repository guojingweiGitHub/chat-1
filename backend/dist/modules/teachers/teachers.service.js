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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const teacher_entity_1 = require("./teacher.entity");
let TeachersService = class TeachersService {
    teachersRepository;
    constructor(teachersRepository) {
        this.teachersRepository = teachersRepository;
    }
    async findAll(query) {
        const { keyword, campusId, status, page = 1, pageSize = 10 } = query;
        const qb = this.teachersRepository.createQueryBuilder('teacher')
            .leftJoinAndSelect('teacher.campus', 'campus');
        if (keyword) {
            qb.andWhere('(teacher.name LIKE :kw OR teacher.phone LIKE :kw OR teacher.subjects LIKE :kw)', { kw: `%${keyword}%` });
        }
        if (campusId) {
            qb.andWhere('teacher.campusId = :campusId', { campusId });
        }
        if (status) {
            qb.andWhere('teacher.status = :status', { status });
        }
        const total = await qb.getCount();
        const items = await qb
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('teacher.createdAt', 'DESC')
            .getMany();
        return { items, total, page, pageSize };
    }
    async findAllActive() {
        return this.teachersRepository.find({
            where: { status: 'active' },
            relations: { campus: true },
        });
    }
    async findOne(id) {
        const teacher = await this.teachersRepository.findOne({
            where: { id },
            relations: { campus: true },
        });
        if (!teacher) {
            throw new common_1.NotFoundException('教师不存在');
        }
        return teacher;
    }
    async create(dto) {
        const teacher = this.teachersRepository.create(dto);
        return this.teachersRepository.save(teacher);
    }
    async update(id, dto) {
        const teacher = await this.findOne(id);
        Object.assign(teacher, dto);
        return this.teachersRepository.save(teacher);
    }
    async remove(id) {
        const teacher = await this.findOne(id);
        await this.teachersRepository.remove(teacher);
        return { message: '删除成功' };
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(teacher_entity_1.Teacher)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map
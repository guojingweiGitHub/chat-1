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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_entity_1 = require("./class.entity");
let ClassesService = class ClassesService {
    classesRepository;
    constructor(classesRepository) {
        this.classesRepository = classesRepository;
    }
    async findAll(query) {
        const { keyword, campusId, teacherId, status, page = 1, pageSize = 10 } = query;
        const qb = this.classesRepository.createQueryBuilder('class')
            .leftJoinAndSelect('class.campus', 'campus')
            .leftJoinAndSelect('class.teacher', 'teacher');
        if (keyword) {
            qb.andWhere('(class.name LIKE :kw OR class.subject LIKE :kw)', { kw: `%${keyword}%` });
        }
        if (campusId) {
            qb.andWhere('class.campusId = :campusId', { campusId });
        }
        if (teacherId) {
            qb.andWhere('class.teacherId = :teacherId', { teacherId });
        }
        if (status) {
            qb.andWhere('class.status = :status', { status });
        }
        const total = await qb.getCount();
        const items = await qb
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('class.createdAt', 'DESC')
            .getMany();
        return { items, total, page, pageSize };
    }
    async findAllActive() {
        return this.classesRepository.find({
            where: { status: 'active' },
            relations: { campus: true, teacher: true },
        });
    }
    async findOne(id) {
        const classInfo = await this.classesRepository.findOne({
            where: { id },
            relations: { campus: true, teacher: true },
        });
        if (!classInfo) {
            throw new common_1.NotFoundException('班级不存在');
        }
        return classInfo;
    }
    async create(dto) {
        const classInfo = this.classesRepository.create(dto);
        return this.classesRepository.save(classInfo);
    }
    async update(id, dto) {
        const classInfo = await this.findOne(id);
        Object.assign(classInfo, dto);
        return this.classesRepository.save(classInfo);
    }
    async remove(id) {
        const classInfo = await this.findOne(id);
        await this.classesRepository.remove(classInfo);
        return { message: '删除成功' };
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_entity_1.ClassInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClassesService);
//# sourceMappingURL=classes.service.js.map
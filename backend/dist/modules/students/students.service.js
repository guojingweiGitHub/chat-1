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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("./student.entity");
let StudentsService = class StudentsService {
    studentsRepository;
    constructor(studentsRepository) {
        this.studentsRepository = studentsRepository;
    }
    async findAll(query) {
        const { keyword, campusId, classId, status, page = 1, pageSize = 10 } = query;
        const qb = this.studentsRepository.createQueryBuilder('student')
            .leftJoinAndSelect('student.campus', 'campus')
            .leftJoinAndSelect('student.class', 'class');
        if (keyword) {
            qb.andWhere('(student.name LIKE :kw OR student.phone LIKE :kw OR student.parentName LIKE :kw OR student.parentPhone LIKE :kw)', { kw: `%${keyword}%` });
        }
        if (campusId) {
            qb.andWhere('student.campusId = :campusId', { campusId });
        }
        if (classId) {
            qb.andWhere('student.classId = :classId', { classId });
        }
        if (status) {
            qb.andWhere('student.status = :status', { status });
        }
        const total = await qb.getCount();
        const items = await qb
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('student.createdAt', 'DESC')
            .getMany();
        return { items, total, page, pageSize };
    }
    async findOne(id) {
        const student = await this.studentsRepository.findOne({
            where: { id },
            relations: { campus: true, class: true },
        });
        if (!student) {
            throw new common_1.NotFoundException('学生不存在');
        }
        return student;
    }
    async create(dto) {
        const existing = await this.studentsRepository.findOne({ where: { phone: dto.phone } });
        if (existing) {
            throw new common_1.BadRequestException('该手机号已存在');
        }
        const student = this.studentsRepository.create(dto);
        return this.studentsRepository.save(student);
    }
    async update(id, dto) {
        const student = await this.findOne(id);
        if (dto.phone && dto.phone !== student.phone) {
            const existing = await this.studentsRepository.findOne({ where: { phone: dto.phone } });
            if (existing) {
                throw new common_1.BadRequestException('该手机号已存在');
            }
        }
        Object.assign(student, dto);
        return this.studentsRepository.save(student);
    }
    async remove(id) {
        const student = await this.findOne(id);
        await this.studentsRepository.remove(student);
        return { message: '删除成功' };
    }
    async batchImport(students) {
        const results = { success: 0, failed: 0, errors: [] };
        for (let i = 0; i < students.length; i++) {
            try {
                const dto = students[i];
                const existing = await this.studentsRepository.findOne({ where: { phone: dto.phone } });
                if (existing) {
                    results.failed++;
                    results.errors.push(`第${i + 1}行: 手机号 ${dto.phone} 已存在`);
                    continue;
                }
                const student = this.studentsRepository.create(dto);
                await this.studentsRepository.save(student);
                results.success++;
            }
            catch (error) {
                results.failed++;
                results.errors.push(`第${i + 1}行: ${error.message}`);
            }
        }
        return results;
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StudentsService);
//# sourceMappingURL=students.service.js.map
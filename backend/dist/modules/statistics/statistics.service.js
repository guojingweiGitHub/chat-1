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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("../students/student.entity");
const payment_entity_1 = require("../fees/payment.entity");
const campus_entity_1 = require("../campuses/campus.entity");
let StatisticsService = class StatisticsService {
    studentsRepository;
    paymentsRepository;
    campusesRepository;
    constructor(studentsRepository, paymentsRepository, campusesRepository) {
        this.studentsRepository = studentsRepository;
        this.paymentsRepository = paymentsRepository;
        this.campusesRepository = campusesRepository;
    }
    async getDashboardStats() {
        const [totalStudents, activeStudents, totalRevenue, pendingPayments] = await Promise.all([
            this.studentsRepository.count(),
            this.studentsRepository.count({ where: { status: 'active' } }),
            this.paymentsRepository
                .createQueryBuilder('payment')
                .select('SUM(payment.amountPaid)', 'total')
                .where('payment.status = :status', { status: 'paid' })
                .getRawOne(),
            this.paymentsRepository.count({ where: { status: 'unpaid' } }),
        ]);
        return {
            totalStudents,
            activeStudents,
            totalRevenue: parseFloat(totalRevenue?.total || '0'),
            pendingPayments,
        };
    }
    async getStudentStats() {
        const [byStatus, byCampus, monthlyTrend] = await Promise.all([
            this.studentsRepository
                .createQueryBuilder('student')
                .select('student.status', 'status')
                .addSelect('COUNT(*)', 'count')
                .groupBy('student.status')
                .getRawMany(),
            this.studentsRepository
                .createQueryBuilder('student')
                .leftJoin('student.campus', 'campus')
                .select('campus.name', 'campusName')
                .addSelect('COUNT(*)', 'count')
                .groupBy('campus.name')
                .getRawMany(),
            this.studentsRepository
                .createQueryBuilder('student')
                .select("TO_CHAR(student.enrollmentDate, 'YYYY-MM')", 'month')
                .addSelect('COUNT(*)', 'count')
                .groupBy("TO_CHAR(student.enrollmentDate, 'YYYY-MM')")
                .orderBy("TO_CHAR(student.enrollmentDate, 'YYYY-MM')", 'DESC')
                .limit(12)
                .getRawMany(),
        ]);
        return { byStatus, byCampus, monthlyTrend: monthlyTrend.reverse() };
    }
    async getPaymentStats() {
        const [byStatus, byCampus, monthlyTrend] = await Promise.all([
            this.paymentsRepository
                .createQueryBuilder('payment')
                .select('payment.status', 'status')
                .addSelect('COUNT(*)', 'count')
                .addSelect('SUM(payment.amountDue)', 'totalDue')
                .addSelect('SUM(payment.amountPaid)', 'totalPaid')
                .groupBy('payment.status')
                .getRawMany(),
            this.paymentsRepository
                .createQueryBuilder('payment')
                .leftJoin('payment.campus', 'campus')
                .select('campus.name', 'campusName')
                .addSelect('SUM(payment.amountDue)', 'totalDue')
                .addSelect('SUM(payment.amountPaid)', 'totalPaid')
                .groupBy('campus.name')
                .getRawMany(),
            this.paymentsRepository
                .createQueryBuilder('payment')
                .select("TO_CHAR(payment.paymentDate, 'YYYY-MM')", 'month')
                .addSelect('SUM(payment.amountPaid)', 'total')
                .where('payment.status = :status', { status: 'paid' })
                .groupBy("TO_CHAR(payment.paymentDate, 'YYYY-MM')")
                .orderBy("TO_CHAR(payment.paymentDate, 'YYYY-MM')", 'DESC')
                .limit(12)
                .getRawMany(),
        ]);
        return { byStatus, byCampus, monthlyTrend: monthlyTrend.reverse() };
    }
    async getCampusComparison() {
        const campuses = await this.campusesRepository.find();
        const result = [];
        for (const campus of campuses) {
            const [studentCount, revenue] = await Promise.all([
                this.studentsRepository.count({ where: { campusId: campus.id } }),
                this.paymentsRepository
                    .createQueryBuilder('payment')
                    .select('SUM(payment.amountPaid)', 'total')
                    .where('payment.campusId = :campusId', { campusId: campus.id })
                    .andWhere('payment.status = :status', { status: 'paid' })
                    .getRawOne(),
            ]);
            result.push({
                campusId: campus.id,
                campusName: campus.name,
                studentCount,
                revenue: parseFloat(revenue?.total || '0'),
            });
        }
        return result;
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(2, (0, typeorm_1.InjectRepository)(campus_entity_1.Campus)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/student.entity';
import { Payment } from '../fees/payment.entity';
import { Campus } from '../campuses/campus.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Campus)
    private campusesRepository: Repository<Campus>,
  ) {}

  // 获取仪表盘统计数据
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

  // 学生统计
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

  // 收费统计
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

  // 校区对比统计
  async getCampusComparison() {
    const campuses = await this.campusesRepository.find();
    const result: { campusId: number; campusName: string; studentCount: number; revenue: number }[] = [];

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
}

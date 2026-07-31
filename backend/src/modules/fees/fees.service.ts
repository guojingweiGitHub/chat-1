import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';
import { FeeCycle } from './fee-cycle.entity';
import { Payment } from './payment.entity';
import {
  CreateFeeCycleDto, UpdateFeeCycleDto, QueryFeeCycleDto,
  CreatePaymentDto, UpdatePaymentDto, QueryPaymentDto,
} from './dto/fee.dto';

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(FeeCycle)
    private feeCyclesRepository: Repository<FeeCycle>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  // ===== 收费周期 =====
  async findAllCycles(query: QueryFeeCycleDto) {
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

  async findOneCycle(id: number) {
    const cycle = await this.feeCyclesRepository.findOne({
      where: { id },
      relations: { campus: true },
    });
    if (!cycle) {
      throw new NotFoundException('收费周期不存在');
    }
    return cycle;
  }

  async createCycle(dto: CreateFeeCycleDto) {
    const cycle = this.feeCyclesRepository.create(dto);
    return this.feeCyclesRepository.save(cycle);
  }

  async updateCycle(id: number, dto: UpdateFeeCycleDto) {
    const cycle = await this.findOneCycle(id);
    Object.assign(cycle, dto);
    return this.feeCyclesRepository.save(cycle);
  }

  async removeCycle(id: number) {
    const cycle = await this.findOneCycle(id);
    await this.feeCyclesRepository.remove(cycle);
    return { message: '删除成功' };
  }

  // ===== 缴费记录 =====
  async findAllPayments(query: QueryPaymentDto) {
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

  async findOnePayment(id: number) {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: { student: true, cycle: true, campus: true },
    });
    if (!payment) {
      throw new NotFoundException('缴费记录不存在');
    }
    return payment;
  }

  async createPayment(dto: CreatePaymentDto, operatorId: number) {
    const payment = this.paymentsRepository.create({
      ...dto,
      operatorId,
    });
    return this.paymentsRepository.save(payment);
  }

  async updatePayment(id: number, dto: UpdatePaymentDto) {
    const payment = await this.findOnePayment(id);
    Object.assign(payment, dto);
    return this.paymentsRepository.save(payment);
  }

  async removePayment(id: number) {
    const payment = await this.findOnePayment(id);
    await this.paymentsRepository.remove(payment);
    return { message: '删除成功' };
  }

  // 获取即将到期的缴费记录
  async getExpiringPayments(days: number = 30) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return this.paymentsRepository.find({
      where: {
        status: 'unpaid',
        dueDate: Between(now, futureDate),
      },
      relations: { student: true, cycle: true, campus: true },
      order: { dueDate: 'ASC' },
    });
  }

  // 获取欠费列表
  async getOverduePayments() {
    const now = new Date();
    return this.paymentsRepository.find({
      where: {
        status: 'unpaid',
        dueDate: LessThanOrEqual(now),
      },
      relations: { student: true, cycle: true, campus: true },
      order: { dueDate: 'ASC' },
    });
  }
}

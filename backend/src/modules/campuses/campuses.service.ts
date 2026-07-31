import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campus } from './campus.entity';
import { CreateCampusDto, UpdateCampusDto, QueryCampusDto } from './dto/campus.dto';

@Injectable()
export class CampusesService {
  constructor(
    @InjectRepository(Campus)
    private campusesRepository: Repository<Campus>,
  ) {}

  async findAll(query: QueryCampusDto) {
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

  async findOne(id: number) {
    const campus = await this.campusesRepository.findOne({ where: { id } });
    if (!campus) {
      throw new NotFoundException('校区不存在');
    }
    return campus;
  }

  async create(dto: CreateCampusDto) {
    const campus = this.campusesRepository.create(dto);
    return this.campusesRepository.save(campus);
  }

  async update(id: number, dto: UpdateCampusDto) {
    const campus = await this.findOne(id);
    Object.assign(campus, dto);
    return this.campusesRepository.save(campus);
  }

  async remove(id: number) {
    const campus = await this.findOne(id);
    await this.campusesRepository.remove(campus);
    return { message: '删除成功' };
  }
}

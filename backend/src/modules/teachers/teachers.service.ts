import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto, UpdateTeacherDto, QueryTeacherDto } from './dto/teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
  ) {}

  async findAll(query: QueryTeacherDto) {
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

  async findOne(id: number) {
    const teacher = await this.teachersRepository.findOne({
      where: { id },
      relations: { campus: true },
    });
    if (!teacher) {
      throw new NotFoundException('教师不存在');
    }
    return teacher;
  }

  async create(dto: CreateTeacherDto) {
    const teacher = this.teachersRepository.create(dto);
    return this.teachersRepository.save(teacher);
  }

  async update(id: number, dto: UpdateTeacherDto) {
    const teacher = await this.findOne(id);
    Object.assign(teacher, dto);
    return this.teachersRepository.save(teacher);
  }

  async remove(id: number) {
    const teacher = await this.findOne(id);
    await this.teachersRepository.remove(teacher);
    return { message: '删除成功' };
  }
}

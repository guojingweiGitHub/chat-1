import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassInfo } from './class.entity';
import { CreateClassDto, UpdateClassDto, QueryClassDto } from './dto/class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(ClassInfo)
    private classesRepository: Repository<ClassInfo>,
  ) {}

  async findAll(query: QueryClassDto) {
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

  async findOne(id: number) {
    const classInfo = await this.classesRepository.findOne({
      where: { id },
      relations: { campus: true, teacher: true },
    });
    if (!classInfo) {
      throw new NotFoundException('班级不存在');
    }
    return classInfo;
  }

  async create(dto: CreateClassDto) {
    const classInfo = this.classesRepository.create(dto);
    return this.classesRepository.save(classInfo);
  }

  async update(id: number, dto: UpdateClassDto) {
    const classInfo = await this.findOne(id);
    Object.assign(classInfo, dto);
    return this.classesRepository.save(classInfo);
  }

  async remove(id: number) {
    const classInfo = await this.findOne(id);
    await this.classesRepository.remove(classInfo);
    return { message: '删除成功' };
  }
}

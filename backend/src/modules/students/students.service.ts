import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto, UpdateStudentDto, QueryStudentDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async findAll(query: QueryStudentDto) {
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

  async findOne(id: number) {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: { campus: true, class: true },
    });
    if (!student) {
      throw new NotFoundException('学生不存在');
    }
    return student;
  }

  async create(dto: CreateStudentDto) {
    const existing = await this.studentsRepository.findOne({ where: { phone: dto.phone } });
    if (existing) {
      throw new BadRequestException('该手机号已存在');
    }
    const student = this.studentsRepository.create(dto);
    return this.studentsRepository.save(student);
  }

  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.findOne(id);
    if (dto.phone && dto.phone !== student.phone) {
      const existing = await this.studentsRepository.findOne({ where: { phone: dto.phone } });
      if (existing) {
        throw new BadRequestException('该手机号已存在');
      }
    }
    Object.assign(student, dto);
    return this.studentsRepository.save(student);
  }

  async remove(id: number) {
    const student = await this.findOne(id);
    await this.studentsRepository.remove(student);
    return { message: '删除成功' };
  }

  async batchImport(students: CreateStudentDto[]) {
    const results = { success: 0, failed: 0, errors: [] as string[] };
    
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
      } catch (error) {
        results.failed++;
        results.errors.push(`第${i + 1}行: ${error.message}`);
      }
    }
    
    return results;
  }
}

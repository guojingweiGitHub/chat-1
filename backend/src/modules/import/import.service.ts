import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/student.entity';
import { Teacher } from '../teachers/teacher.entity';
import { ImportDataDto } from './dto/import.dto';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
  ) {}

  // 模拟AI识别表格（实际项目中应调用OCR/Vision AI服务）
  async recognizeTable(fileBuffer: Buffer, fileName: string) {
    // 这里模拟AI识别结果
    // 实际实现应该调用 PaddleOCR / 通义千问VL / GPT-4o 等服务
    return {
      success: true,
      headers: ['姓名', '性别', '手机号', '家长姓名', '家长电话', '校区', '班级', '入学日期'],
      rows: [
        ['张三', '男', '13800138001', '张父', '13900139001', '总校区', '一年级A班', '2024-09-01'],
        ['李四', '女', '13800138002', '李母', '13900139002', '分校区', '二年级B班', '2024-09-01'],
      ],
      confidence: 0.95,
      message: '模拟AI识别完成，实际项目需替换为真实OCR服务',
    };
  }

  // 自动字段映射
  async autoMapFields(headers: string[]) {
    const fieldMappings: Record<string, string[]> = {
      name: ['姓名', '学生姓名', '名字', 'name'],
      gender: ['性别', 'gender'],
      phone: ['手机号', '电话', '联系电话', 'phone'],
      parentName: ['家长姓名', '家长', '父亲/母亲', 'parent'],
      parentPhone: ['家长电话', '家长手机', 'parentPhone'],
      campus: ['校区', '分校', 'campus'],
      class: ['班级', '班别', 'class'],
      enrollmentDate: ['入学日期', '报名日期', '入学时间', 'enrollmentDate'],
    };

    const mappings = headers.map((header) => {
      let target = '';
      for (const [key, aliases] of Object.entries(fieldMappings)) {
        if (aliases.some((alias) => header.includes(alias))) {
          target = key;
          break;
        }
      }
      return { source: header, target };
    });

    return mappings;
  }

  // 校验导入数据
  async validateData(data: any[], type: string) {
    const errors: { row: number; field: string; message: string }[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      if (type === 'students') {
        if (!row.name || row.name.trim() === '') {
          errors.push({ row: i + 1, field: 'name', message: '姓名不能为空' });
        }
        if (!row.phone || !/^1[3-9]\d{9}$/.test(row.phone)) {
          errors.push({ row: i + 1, field: 'phone', message: '手机号格式不正确' });
        } else {
          const existing = await this.studentsRepository.findOne({ where: { phone: row.phone } });
          if (existing) {
            errors.push({ row: i + 1, field: 'phone', message: '手机号已存在' });
          }
        }
        if (!row.gender || !['男', '女'].includes(row.gender)) {
          errors.push({ row: i + 1, field: 'gender', message: '性别必须为男或女' });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      totalRows: data.length,
      validRows: data.length - new Set(errors.map((e) => e.row)).size,
    };
  }

  // 执行导入
  async executeImport(dto: ImportDataDto) {
    const { data, type, campusId } = dto;
    const results = { success: 0, failed: 0, skipped: 0, errors: [] as string[] };

    if (type === 'students') {
      for (let i = 0; i < data.length; i++) {
        try {
          const row = data[i];
          const existing = await this.studentsRepository.findOne({ where: { phone: row.phone } });
          if (existing) {
            results.skipped++;
            results.errors.push(`第${i + 1}行: 手机号 ${row.phone} 已存在，已跳过`);
            continue;
          }

          const student = this.studentsRepository.create({
            name: row.name,
            gender: row.gender,
            phone: row.phone,
            parentName: row.parentName,
            parentPhone: row.parentPhone,
            campusId: campusId || 1,
            enrollmentDate: row.enrollmentDate ? new Date(row.enrollmentDate) : new Date(),
            status: 'active',
          });
          await this.studentsRepository.save(student);
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(`第${i + 1}行: ${error.message}`);
        }
      }
    } else if (type === 'teachers') {
      for (let i = 0; i < data.length; i++) {
        try {
          const row = data[i];
          const teacher = this.teachersRepository.create({
            name: row.name,
            phone: row.phone,
            campusId: campusId || 1,
            subjects: row.subjects,
            hireDate: row.hireDate ? new Date(row.hireDate) : new Date(),
            status: 'active',
          });
          await this.teachersRepository.save(teacher);
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(`第${i + 1}行: ${error.message}`);
        }
      }
    } else {
      throw new BadRequestException('不支持的导入类型');
    }

    return results;
  }
}

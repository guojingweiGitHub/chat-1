import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async findAll() {
    return this.rolesRepository.find({ order: { createdAt: 'ASC' } });
  }

  async findOne(id: number) {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    return role;
  }

  async create(dto: CreateRoleDto) {
    const existing = await this.rolesRepository.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new BadRequestException('角色编码已存在');
    }
    const role = this.rolesRepository.create(dto);
    return this.rolesRepository.save(role);
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.findOne(id);
    Object.assign(role, dto);
    return this.rolesRepository.save(role);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (role.code === 'admin') {
      throw new BadRequestException('不能删除管理员角色');
    }
    await this.rolesRepository.remove(role);
    return { message: '删除成功' };
  }
}

import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
export declare class RolesService {
    private rolesRepository;
    constructor(rolesRepository: Repository<Role>);
    findAll(): Promise<Role[]>;
    findOne(id: number): Promise<Role>;
    create(dto: CreateRoleDto): Promise<Role>;
    update(id: number, dto: UpdateRoleDto): Promise<Role>;
    remove(id: number): Promise<{
        message: string;
    }>;
}

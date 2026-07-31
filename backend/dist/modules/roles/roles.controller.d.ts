import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<import("./role.entity").Role[]>;
    findOne(id: number): Promise<import("./role.entity").Role>;
    create(dto: CreateRoleDto): Promise<import("./role.entity").Role>;
    update(id: number, dto: UpdateRoleDto): Promise<import("./role.entity").Role>;
    remove(id: number): Promise<{
        message: string;
    }>;
}

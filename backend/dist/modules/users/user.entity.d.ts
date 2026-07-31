import { Role } from '../roles/role.entity';
import { Campus } from '../campuses/campus.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    realName: string;
    phone: string;
    email: string;
    avatar: string;
    roleId: number;
    role: Role;
    campusId: number;
    campus: Campus;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

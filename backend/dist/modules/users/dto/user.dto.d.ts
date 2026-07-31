export declare class CreateUserDto {
    username: string;
    password: string;
    realName: string;
    phone: string;
    email?: string;
    roleId: number;
    campusId?: number;
    status?: string;
}
export declare class UpdateUserDto {
    realName?: string;
    phone?: string;
    email?: string;
    roleId?: number;
    campusId?: number;
    status?: string;
}
export declare class ResetPasswordDto {
    newPassword: string;
}
export declare class QueryUserDto {
    keyword?: string;
    roleId?: number;
    campusId?: number;
    status?: string;
    page?: number;
    pageSize?: number;
}

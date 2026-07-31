export declare class CreateRoleDto {
    name: string;
    code: string;
    description?: string;
    permissions?: string[];
}
export declare class UpdateRoleDto {
    name?: string;
    description?: string;
    permissions?: string[];
}

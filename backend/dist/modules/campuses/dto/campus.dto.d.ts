export declare class CreateCampusDto {
    name: string;
    address: string;
    phone: string;
    managerId?: number;
    managerName?: string;
    status?: string;
}
export declare class UpdateCampusDto {
    name?: string;
    address?: string;
    phone?: string;
    managerId?: number;
    managerName?: string;
    status?: string;
}
export declare class QueryCampusDto {
    keyword?: string;
    status?: string;
    page?: number;
    pageSize?: number;
}

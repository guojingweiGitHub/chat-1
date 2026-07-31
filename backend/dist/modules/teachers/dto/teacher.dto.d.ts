export declare class CreateTeacherDto {
    name: string;
    phone: string;
    campusId: number;
    subjects?: string;
    hireDate: Date;
    status?: string;
}
export declare class UpdateTeacherDto {
    name?: string;
    phone?: string;
    campusId?: number;
    subjects?: string;
    hireDate?: Date;
    status?: string;
}
export declare class QueryTeacherDto {
    keyword?: string;
    campusId?: number;
    status?: string;
    page?: number;
    pageSize?: number;
}

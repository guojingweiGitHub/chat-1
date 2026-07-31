export declare class CreateStudentDto {
    name: string;
    gender: string;
    birthDate?: Date;
    phone: string;
    parentName?: string;
    parentPhone?: string;
    campusId: number;
    classId?: number;
    enrollmentDate: Date;
    status?: string;
    remark?: string;
}
export declare class UpdateStudentDto {
    name?: string;
    gender?: string;
    birthDate?: Date;
    phone?: string;
    parentName?: string;
    parentPhone?: string;
    campusId?: number;
    classId?: number;
    status?: string;
    remark?: string;
}
export declare class QueryStudentDto {
    keyword?: string;
    campusId?: number;
    classId?: number;
    status?: string;
    page?: number;
    pageSize?: number;
}

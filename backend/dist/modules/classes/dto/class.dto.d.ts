export declare class CreateClassDto {
    name: string;
    campusId: number;
    subject?: string;
    teacherId?: number;
    capacity?: number;
    startDate: Date;
    endDate?: Date;
    status?: string;
}
export declare class UpdateClassDto {
    name?: string;
    campusId?: number;
    subject?: string;
    teacherId?: number;
    capacity?: number;
    startDate?: Date;
    endDate?: Date;
    status?: string;
}
export declare class QueryClassDto {
    keyword?: string;
    campusId?: number;
    teacherId?: number;
    status?: string;
    page?: number;
    pageSize?: number;
}

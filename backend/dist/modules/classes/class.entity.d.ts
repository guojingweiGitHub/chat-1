import { Campus } from '../campuses/campus.entity';
import { Teacher } from '../teachers/teacher.entity';
export declare class ClassInfo {
    id: number;
    name: string;
    campusId: number;
    campus: Campus;
    subject: string;
    teacherId: number;
    teacher: Teacher;
    capacity: number;
    startDate: Date;
    endDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

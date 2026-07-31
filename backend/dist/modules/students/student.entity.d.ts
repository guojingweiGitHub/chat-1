import { Campus } from '../campuses/campus.entity';
import { ClassInfo } from '../classes/class.entity';
export declare class Student {
    id: number;
    name: string;
    gender: string;
    birthDate: Date;
    phone: string;
    parentName: string;
    parentPhone: string;
    campusId: number;
    campus: Campus;
    classId: number;
    class: ClassInfo;
    enrollmentDate: Date;
    status: string;
    remark: string;
    createdAt: Date;
    updatedAt: Date;
}

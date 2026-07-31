import { Campus } from '../campuses/campus.entity';
export declare class Teacher {
    id: number;
    name: string;
    phone: string;
    campusId: number;
    campus: Campus;
    subjects: string;
    hireDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

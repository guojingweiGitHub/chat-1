import { Student } from '../students/student.entity';
import { FeeCycle } from './fee-cycle.entity';
import { Campus } from '../campuses/campus.entity';
export declare class Payment {
    id: number;
    studentId: number;
    student: Student;
    cycleId: number;
    cycle: FeeCycle;
    campusId: number;
    campus: Campus;
    amountDue: number;
    amountPaid: number;
    discountRate: number;
    discountReason: string;
    paymentDate: Date;
    paymentMethod: string;
    operatorId: number;
    status: string;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

import { Repository } from 'typeorm';
import { Student } from '../students/student.entity';
import { Payment } from '../fees/payment.entity';
import { Campus } from '../campuses/campus.entity';
export declare class StatisticsService {
    private studentsRepository;
    private paymentsRepository;
    private campusesRepository;
    constructor(studentsRepository: Repository<Student>, paymentsRepository: Repository<Payment>, campusesRepository: Repository<Campus>);
    getDashboardStats(): Promise<{
        totalStudents: number;
        activeStudents: number;
        totalRevenue: number;
        pendingPayments: number;
    }>;
    getStudentStats(): Promise<{
        byStatus: any[];
        byCampus: any[];
        monthlyTrend: any[];
    }>;
    getPaymentStats(): Promise<{
        byStatus: any[];
        byCampus: any[];
        monthlyTrend: any[];
    }>;
    getCampusComparison(): Promise<{
        campusId: number;
        campusName: string;
        studentCount: number;
        revenue: number;
    }[]>;
}

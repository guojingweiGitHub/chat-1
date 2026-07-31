import { StatisticsService } from './statistics.service';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
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

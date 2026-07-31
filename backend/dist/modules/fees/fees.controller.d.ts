import { FeesService } from './fees.service';
import { CreateFeeCycleDto, UpdateFeeCycleDto, QueryFeeCycleDto, CreatePaymentDto, UpdatePaymentDto, QueryPaymentDto } from './dto/fee.dto';
export declare class FeesController {
    private readonly feesService;
    constructor(feesService: FeesService);
    findAllCycles(query: QueryFeeCycleDto): Promise<{
        items: import("./fee-cycle.entity").FeeCycle[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOneCycle(id: number): Promise<import("./fee-cycle.entity").FeeCycle>;
    createCycle(dto: CreateFeeCycleDto): Promise<import("./fee-cycle.entity").FeeCycle>;
    updateCycle(id: number, dto: UpdateFeeCycleDto): Promise<import("./fee-cycle.entity").FeeCycle>;
    removeCycle(id: number): Promise<{
        message: string;
    }>;
    findAllPayments(query: QueryPaymentDto): Promise<{
        items: import("./payment.entity").Payment[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    getExpiringPayments(days?: number): Promise<import("./payment.entity").Payment[]>;
    getOverduePayments(): Promise<import("./payment.entity").Payment[]>;
    findOnePayment(id: number): Promise<import("./payment.entity").Payment>;
    createPayment(dto: CreatePaymentDto, userId: number): Promise<import("./payment.entity").Payment>;
    updatePayment(id: number, dto: UpdatePaymentDto): Promise<import("./payment.entity").Payment>;
    removePayment(id: number): Promise<{
        message: string;
    }>;
}

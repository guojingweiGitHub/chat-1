import { Repository } from 'typeorm';
import { FeeCycle } from './fee-cycle.entity';
import { Payment } from './payment.entity';
import { CreateFeeCycleDto, UpdateFeeCycleDto, QueryFeeCycleDto, CreatePaymentDto, UpdatePaymentDto, QueryPaymentDto } from './dto/fee.dto';
export declare class FeesService {
    private feeCyclesRepository;
    private paymentsRepository;
    constructor(feeCyclesRepository: Repository<FeeCycle>, paymentsRepository: Repository<Payment>);
    findAllCycles(query: QueryFeeCycleDto): Promise<{
        items: FeeCycle[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOneCycle(id: number): Promise<FeeCycle>;
    createCycle(dto: CreateFeeCycleDto): Promise<FeeCycle>;
    updateCycle(id: number, dto: UpdateFeeCycleDto): Promise<FeeCycle>;
    removeCycle(id: number): Promise<{
        message: string;
    }>;
    findAllPayments(query: QueryPaymentDto): Promise<{
        items: Payment[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOnePayment(id: number): Promise<Payment>;
    createPayment(dto: CreatePaymentDto, operatorId: number): Promise<Payment>;
    updatePayment(id: number, dto: UpdatePaymentDto): Promise<Payment>;
    removePayment(id: number): Promise<{
        message: string;
    }>;
    getExpiringPayments(days?: number): Promise<Payment[]>;
    getOverduePayments(): Promise<Payment[]>;
}

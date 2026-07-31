export declare class CreateFeeCycleDto {
    name: string;
    type: string;
    startDate: Date;
    endDate: Date;
    standardFee: number;
    campusId: number;
}
export declare class UpdateFeeCycleDto {
    name?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
    standardFee?: number;
    campusId?: number;
}
export declare class QueryFeeCycleDto {
    keyword?: string;
    type?: string;
    campusId?: number;
    page?: number;
    pageSize?: number;
}
export declare class CreatePaymentDto {
    studentId: number;
    cycleId: number;
    campusId: number;
    amountDue: number;
    amountPaid?: number;
    discountRate?: number;
    discountReason?: string;
    paymentDate?: Date;
    paymentMethod?: string;
    status?: string;
    dueDate: Date;
}
export declare class UpdatePaymentDto {
    amountPaid?: number;
    discountRate?: number;
    discountReason?: string;
    paymentDate?: Date;
    paymentMethod?: string;
    status?: string;
}
export declare class QueryPaymentDto {
    keyword?: string;
    campusId?: number;
    cycleId?: number;
    status?: string;
    page?: number;
    pageSize?: number;
}

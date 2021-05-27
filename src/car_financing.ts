export class CarFinancing {
    public docType: string;
    public carId: string;
    public price: number;
    public payment: number;
    public payPerMonth: number;
    public debtor: string;
    public creditor: string;
    public timestamp: Date;
}

export class CarFinancingPayment {
    public docType?: string;
    public financeId: string;
    public payment: number;
    public debtor: string;
    public creditor: string;
    public timestamp: Date;
}

export interface LoanAccount {
    id: number;
    totalAmount: number;
    accountOpeningDate: number;
    loanType: string;
    processingCharge: number;
    numberOfEmi: number;
    emiType: string;
    accountStatus: string;
    createdAt: Date;

}
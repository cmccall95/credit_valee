// src/lib/types.ts
export interface Client {
    id: number;
    name: string;
    phoneNumber: string;
    paymentFrequency: string;
    depositPaid: number;
    firstPayment: number;
    regularPayment: number;
    startDate: Date;
    numberOfPayments: number;
    notes: string;
  }
  
  export interface Payment {
    number: number;
    date: Date;
    amount: number;
    status: string;
    dueIn: number | null;
    clientId: number;
    clientName: string;
  }
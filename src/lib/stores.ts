// src/lib/stores.ts
import { writable } from 'svelte/store';
import type { Client } from './types';

const initialClients: Client[] = [
  {
    id: 1,
    name: "Susan Alvarado",
    phoneNumber: "",
    paymentFrequency: "Bi-Weekly",
    depositPaid: 50.49,
    firstPayment: 150,
    regularPayment: 100,
    startDate: new Date("2024-9-15"),
    numberOfPayments: 13,
    notes: "7 Bundle offer after can extend for $49.99",
  },
  {
    id: 2,
    name: "James Wilson",
    phoneNumber: "555-0123",
    paymentFrequency: "Bi-Weekly",
    depositPaid: 75.0,
    firstPayment: 200,
    regularPayment: 150,
    startDate: new Date("2024-7-20"),
    numberOfPayments: 12,
    notes: "",
  },
];

export interface OptionList {
  id: string;
  options: string[];
}

const defaultLists: OptionList[] = [
  {
      id: 'paymentFrequency',
      options: ['Weekly', 'Bi-Weekly', 'Monthly']
  }
];

export const clients = writable<Client[]>(initialClients);
export const optionLists = writable<OptionList[]>(defaultLists);
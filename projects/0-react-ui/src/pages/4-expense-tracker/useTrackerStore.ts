import { create } from "zustand";

const transactionList = [
  { id: 1, description: "salary", amount: -1000 },
  { id: 2, description: "buy a food", amount: 22 },
  { id: 3, description: "eating", amount: 12 },
  { id: 4, description: "buy a new phone", amount: 99 },
  { id: 5, description: "buy a car", amount: 100 },
];
export interface Transaction {
  id: number;
  description: string;
  amount: number;
}
export interface ExpenseTracker {
  income: number;
  expenses: number;
  balance: number;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: number) => void;
}

export const useTrackStore = create<ExpenseTracker>((set, get) => ({
  income: 0,
  expenses: 0,
  balance: 0,
  transactions: transactionList,

  addTransaction: (transaction: Transaction) => {
    transaction.id = new Date().getTime();
    set({
      income: get().balance + transaction.amount,
      balance: get().balance + transaction.amount,
      transactions: [...get().transactions, transaction],
    });
  },
  removeTransaction: (id: number) => {
    const restTransactions = get().transactions.filter(
      (transaction) => transaction.id !== id
    );

    set({
      transactions: restTransactions,
    });
  },
}));

import type { Transaction } from "./useTrackerStore";

const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div className="h-full p-4">
      <h2 className="text-2xl font-md">Transactions</h2>
      <div className="space-y-2 overflow-auto p-2">
        {transactions.map((transaction) => (
          <Transaction
            key={transaction.id}
            description={transaction.description}
            amount={transaction.amount}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;

const Transaction = ({
  description,
  amount,
}: {
  description: string;
  amount: number;
}) => {
  const isExpense = amount < 0;
  return (
    <div
      // rounded-xl形成了特色右边框
      className={`flex justify-between items-center pl-4 py-4 pr-6 shadow-md rounded-xl border-r-6 ${
        isExpense ? "border-r-red-600" : "border-r-green-600"
      } hover:shadow-lg hover:translate-x-1 transition-all duration-200 group`}
    >
      <span>{description}</span>
      <div className="flex items-center justify-end gap-8">
        <span>
          {isExpense && "-"}${Math.abs(amount)}
        </span>
        <span
          className="
    text-red-500 font-semibold transition-colors duration-300 p-1 rounded-sm
    opacity-0 pointer-events-none
    group-hover:opacity-100 group-hover:pointer-events-auto
    hover:bg-red-200 hover:cursor-pointer"
        >
          X
        </span>
      </div>
    </div>
  );
};

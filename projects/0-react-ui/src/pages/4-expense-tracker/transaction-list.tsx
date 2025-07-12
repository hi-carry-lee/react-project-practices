import { type Transaction, useTrackStore } from "./useTrackerStore";

const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div className=" p-4">
      <h2 className="text-2xl font-md">Transactions</h2>
      <ul className="space-y-2 overflow-y-auto max-h-[500px] p-2 custom-scrollbar">
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <Transaction
              id={transaction.id}
              description={transaction.description}
              amount={transaction.amount}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;

const Transaction = ({
  id,
  description,
  amount,
}: {
  id: number;
  description: string;
  amount: number;
}) => {
  const isExpense = amount < 0;
  const { removeTransaction } = useTrackStore();
  const handleDelete = () => {
    removeTransaction(id);
  };
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
          onClick={handleDelete}
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

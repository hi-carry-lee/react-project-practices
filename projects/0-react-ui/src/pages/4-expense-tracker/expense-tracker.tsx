import AddTransaction from "./add-transaction";
import Balance from "./balance";
import TransactionList from "./transaction-list";
import { useTrackStore } from "./useTrackerStore";

const ExpenseTracker = () => {
  const { transactions } = useTrackStore();
  return (
    <div className="h-screen bg-gradient-to-br from-green-600 via-green-400 to-green-200 pt-18 px-8 pb-2 flex justify-center">
      <div className="rounded-2xl p-6 bg-white max-w-6xl w-full flex flex-col">
        <h1 className="text-center text-4xl font-bold">Expense Tracker</h1>
        <Balance />
        <div className="grid grid-cols-2 gap-4 mt-6 flex-1 text-gray-700">
          <TransactionList transactions={transactions} />
          <AddTransaction />
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;

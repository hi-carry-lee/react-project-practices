import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTrackStore } from "./useTrackerStore";

const AddTransaction = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const { addTransaction } = useTrackStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (description === "" || Number(amount) === 0) {
      toast.error("Please fill in all fields");
      return;
    }
    addTransaction({
      id: Date.now(),
      description,
      amount: Number(amount),
    });
    setDescription("");
    setAmount("");
    toast.success("Transaction added successfully");
  };
  return (
    <div className="h-full p-6 bg-slate-100 rounded-xl flex flex-col gap-6 ">
      <h2 className="text-xl font-medium mt-2">Add Transaction</h2>
      {/* to make button at the bottom, it need a hight*/}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between h-full"
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium" htmlFor="description">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              className="w-full px-4 py-3 rounded-md bg-white"
              placeholder="Enter description"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium" htmlFor="amount">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              className="w-full px-4 py-2 rounded-md bg-white"
              placeholder="Enter amount"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
            <span className="text-sm text-gray-500">
              Use negative (-) for expenses
            </span>
          </div>
        </div>
        <button className="w-ful bg-emerald-700 py-3 text-white text-lg rounded-2xl cursor-pointer hover:-translate-y-1 transition-all duration-200">
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;

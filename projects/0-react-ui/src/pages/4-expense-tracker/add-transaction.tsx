const AddTransaction = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
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
              className="w-full px-4 py-3 rounded-md bg-white"
              placeholder="Enter description"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium" htmlFor="amount">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              className="w-full px-4 py-2 rounded-md bg-white"
              placeholder="Enter amount"
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

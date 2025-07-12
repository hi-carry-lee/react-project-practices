import { useTrackStore } from "./useTrackerStore";

const Balance = () => {
  const { income, expenses } = useTrackStore();
  return (
    <div className="w-full bg-gradient-to-br from-lime-200 via-lime-400 to-lime-600 mt-8 p-6 rounded-2xl space-y-6">
      <h2 className="text-center text-xl font-semibold text-gray-600">
        Your Balance
      </h2>
      <p className="text-center text-5xl font-bold">${income + expenses}</p>
      <div className="flex justify-center items-center gap-6 w-full">
        <Card title="Income" amount={income} color="text-green-600" />
        <Card title="Expenses" amount={expenses} color="text-red-500" />
      </div>
    </div>
  );
};

export default Balance;

const Card = ({
  title,
  amount,
  color,
}: {
  title: string;
  amount: number;
  color: string;
}) => {
  console.log("Card - amount: ", amount);

  return (
    <div
      className={`bg-white text-center rounded-2xl w-full px-8 py-6 space-y-4 ${color}`}
    >
      <h3 className=" text-lg">{title}</h3>
      <p className="text-3xl font-bold">
        {amount < 0 && "-"}${Math.abs(amount)}
      </p>
    </div>
  );
};

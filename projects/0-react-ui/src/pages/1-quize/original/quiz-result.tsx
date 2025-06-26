const QuizResult = ({
  score,
  setStage,
  setIndex,
  setScore,
}: {
  score: number;
  setStage: (stage: number) => void;
  setIndex: (index: number) => void;
  setScore: (score: number) => void;
}) => {
  const handleRestart = () => {
    setStage(1);
    setIndex(0);
    setScore(0);
  };
  return (
    <div className="bg-white px-10 py-8 rounded-2xl shadow-2xl w-full space-y-4">
      <h1 className="text-3xl font-bold text-center text-orange-600">
        Quiz Results
      </h1>
      <div className="bg-rose-100 text-center p-4 w-full rounded-2xl space-y-2">
        <p className="text-xl">You scored {score} out of 5</p>
        <p className="text-2xl font-bold text-orange-400">
          {score === 5
            ? "You are a genius!"
            : score == 4
            ? "Keep studying! You'll get better!"
            : "You are a normal person!"}
        </p>
      </div>
      <div className="flex justify-center">
        <button
          className="bg-orange-400 text-white px-8 py-3 rounded-lg  text-lg cursor-pointer hover:bg-orange-500 duration-200 "
          onClick={handleRestart}
        >
          Restart Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResult;

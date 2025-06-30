import { useQuizStore } from "./quizStore";
import type { QuizProps } from "../quiz-type";

const Quiz = ({ quiz }: { quiz: QuizProps }) => {
  const { selectedAns, handleAnswer, handleAnswerWithDelay, quizIndex, score } =
    useQuizStore();

  const handleAnswerClick = (answer: { text: string; correct: boolean }) => {
    handleAnswer(answer);
    handleAnswerWithDelay();
  };
  return (
    <div className="bg-white px-10 py-8 rounded-2xl shadow-2xl w-full space-y-4">
      <h1 className="text-xl font-bold text-center">{quiz.question}</h1>
      <div className="flex justify-between">
        <span>
          Question {quizIndex + 1} of {5}
        </span>
        <span>Score: {score}</span>
      </div>
      <div className="space-y-2">
        {quiz.answers.map((answer) => (
          <div
            key={answer.text}
            className={`p-4 rounded-2xl bg-amber-200 cursor-pointer hover:bg-amber-300 duration-200 ${
              selectedAns && answer.correct && "bg-green-400 hover:bg-green-400"
            } ${
              !answer.correct &&
              selectedAns === answer.text &&
              "bg-red-400 hover:bg-red-400"
            }`}
            onClick={() => handleAnswerClick(answer)}
          >
            {answer.text}
          </div>
        ))}
      </div>
      {/* progress bar  */}
      <div className="w-full h-2 bg-amber-200 rounded-2xl">
        <div
          className="h-full bg-amber-500 rounded-2xl"
          style={{ width: `${(quizIndex / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Quiz;

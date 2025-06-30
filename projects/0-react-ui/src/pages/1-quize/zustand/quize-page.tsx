import { useQuizStore } from "./quizStore";
import { quizQuestions } from "../quiz-list";
import Quiz from "./quiz";
import QuizResult from "./quiz-result";

const QuizStart = () => {
  const { startQuiz } = useQuizStore();

  return (
    <div className="text-center space-y-6 bg-white px-30 py-8 rounded-2xl shadow-2xl opacity-90">
      <h1 className="text-4xl font-bold text-orange-500">
        Quiz Time!
        <span className="text-lg font-bold text-blue-500">(Zustand)</span>
      </h1>
      <p>Test your knowledge with these fun questions</p>
      <button
        className="bg-orange-600 text-white px-5 py-3 rounded-lg  text-lg cursor-pointer hover:bg-orange-700 duration-200"
        onClick={startQuiz}
      >
        Start Quiz
      </button>
    </div>
  );
};

const QuizePageZustand = () => {
  const { stage, quizIndex } = useQuizStore();

  return (
    <div className="bg-orange-50">
      <div className="mx-auto max-w-2xl flex items-center justify-center ">
        {stage === 0 && <QuizStart />}
        {stage === 1 && <Quiz quiz={quizQuestions[quizIndex]} />}
        {stage === 2 && <QuizResult />}
      </div>
    </div>
  );
};

export default QuizePageZustand;

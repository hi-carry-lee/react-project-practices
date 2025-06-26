import { useState } from "react";
import { quizQuestions } from "../quiz-list";
import Quiz from "./quiz";
import QuizResult from "./quiz-result";

const QuizStart = ({ setStage }: { setStage: (stage: number) => void }) => {
  const handleStartQuiz = () => {
    setStage(1);
  };
  return (
    <div className="text-center space-y-6 bg-white px-30 py-8 rounded-2xl shadow-2xl opacity-90">
      <h1 className="text-4xl font-bold text-orange-500">Quiz Time!</h1>
      <p>Test your knowledge with these fun questions</p>
      <button
        className="bg-orange-600 text-white px-5 py-3 rounded-lg  text-lg cursor-pointer hover:bg-orange-700 duration-200"
        onClick={handleStartQuiz}
      >
        Start Quiz
      </button>
    </div>
  );
};

const QuizePage = () => {
  const [stage, setStage] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  return (
    <div className="bg-orange-50">
      <div className="h-screen mx-auto max-w-2xl flex items-center justify-center ">
        {stage === 0 && <QuizStart setStage={setStage} />}
        {stage === 1 && (
          <Quiz
            quiz={quizQuestions[index]}
            index={index}
            setIndex={setIndex}
            score={score}
            setScore={setScore}
            setStage={setStage}
          />
        )}
        {stage === 2 && (
          <QuizResult
            score={score}
            setStage={setStage}
            setIndex={setIndex}
            setScore={setScore}
          />
        )}
      </div>
    </div>
  );
};

export default QuizePage;

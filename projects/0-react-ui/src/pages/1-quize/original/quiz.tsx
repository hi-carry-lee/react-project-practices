import { useState } from "react";
import type { QuizProps } from "../quiz-type";

const Quiz = ({
  quiz,
  index,
  setIndex,
  score,
  setScore,
  setStage,
}: {
  quiz: QuizProps;
  index: number;
  setIndex: (index: number) => void;
  score: number;
  setScore: (score: number) => void;
  setStage: (stage: number) => void;
}) => {
  const [clickedAnswer, setClickedAnswer] = useState<string>("");

  const handleAnswer = (answer: { text: string; correct: boolean }) => {
    setClickedAnswer(answer.text);
    if (answer.correct) {
      setScore(score + 1);
    }
    // I hope the following code work 1 second later, how to do it?
    setTimeout(() => {
      setIndex(index + 1);
      setClickedAnswer("");
      if (index === 4) {
        setStage(2);
      }
    }, 1000);
  };
  return (
    <div className="bg-white px-10 py-8 rounded-2xl shadow-2xl w-full space-y-4">
      <h1 className="text-xl font-bold text-center">{quiz.question}</h1>
      <div className="flex justify-between">
        <span>
          Question {index + 1} of {5}
        </span>
        <span>Score: {score}</span>
      </div>
      <div className="space-y-2">
        {quiz.answers.map((answer) => (
          <div
            key={answer.text}
            className={`p-4 rounded-2xl bg-amber-200 cursor-pointer hover:bg-amber-300 duration-200 ${
              clickedAnswer &&
              answer.correct &&
              "bg-green-400 hover:bg-green-400"
            } ${
              !answer.correct &&
              clickedAnswer === answer.text &&
              "bg-red-400 hover:bg-red-400"
            }`}
            onClick={() => handleAnswer(answer)}
          >
            {answer.text}
          </div>
        ))}
      </div>
      {/* progress bar  */}
      <div className="w-full h-2 bg-amber-200 rounded-2xl">
        <div
          className="h-full bg-amber-500 rounded-2xl"
          style={{ width: `${(index / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Quiz;

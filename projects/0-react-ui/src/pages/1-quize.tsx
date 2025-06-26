import { useState } from "react";

interface QuizProps {
  question: string;
  answers: { text: string; correct: boolean }[];
}

const QuizHome = ({ setStage }: { setStage: (stage: number) => void }) => {
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
        {stage === 0 && <QuizHome setStage={setStage} />}
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

export default QuizePage;

const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
];

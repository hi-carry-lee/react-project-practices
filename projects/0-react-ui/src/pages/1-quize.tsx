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

  return (
    <div className="bg-orange-50">
      <div className="h-screen mx-auto max-w-2xl flex items-center justify-center ">
        {stage === 0 && <QuizHome setStage={setStage} />}
        {stage === 1 && (
          <Quiz quizList={quizQuestions} index={index} setIndex={setIndex} />
        )}
        {stage === 2 && <QuizResult />}
      </div>
    </div>
  );
};

const Quiz = ({
  quizList,
  index,
}: {
  quizList: QuizProps[];
  index: number;
  setIndex: (index: number) => void;
}) => {
  const quiz = quizList[index];
  return (
    <div className="bg-white px-30 py-8 rounded-2xl shadow-2xl ">
      <QuizItem
        key={quiz.question}
        quiz={quiz}
        index={index}
        total={quizList.length}
      />
    </div>
  );
};

const QuizItem = ({
  quiz,
  index,
  total,
}: {
  quiz: QuizProps;
  index: number;
  total: number;
}) => {
  return (
    <div>
      <h1 className="text-xl font-bold">{quiz.question}</h1>
      <div>
        <span>
          Question {index + 1} of {total}
        </span>
        <span>Score:</span>
      </div>
    </div>
  );
};

const QuizResult = () => {
  return (
    <div>
      <h1>Quiz result</h1>
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

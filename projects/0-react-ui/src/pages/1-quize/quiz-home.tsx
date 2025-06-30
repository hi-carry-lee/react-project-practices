import QuizPage from "./original/quize-page";
import QuizePageZustand from "./zustand/quize-page";

const QuizHome = () => {
  return (
    <div className="h-screen flex justify-center items-center flex-col gap-8">
      <QuizPage />
      <QuizePageZustand />
    </div>
  );
};

export default QuizHome;

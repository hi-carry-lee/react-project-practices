import { create } from "zustand";

interface QuizStore {
  stage: number;
  score: number;
  quizIndex: number;
  selectedAns: string;
  startQuiz: () => void;
  handleAnswer: (answer: { text: string; correct: boolean }) => void;
  handleRestart: () => void;
  handleAnswerWithDelay: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  stage: 0,
  score: 0,
  quizIndex: 0,
  selectedAns: "",

  startQuiz: () => {
    set({
      stage: 1,
    });
  },

  handleAnswer: (answer: { text: string; correct: boolean }) => {
    set({
      selectedAns: answer.text,
      score: answer.correct ? get().score + 1 : get().score,
    });
  },

  handleAnswerWithDelay: () => {
    setTimeout(() => {
      set({
        quizIndex: get().quizIndex + 1,
        selectedAns: "",
        stage: get().quizIndex === 4 ? 2 : get().stage,
      });
    }, 1000);
  },

  handleRestart: () => {
    set({
      stage: 1,
      quizIndex: 0,
      score: 0,
    });
  },
}));

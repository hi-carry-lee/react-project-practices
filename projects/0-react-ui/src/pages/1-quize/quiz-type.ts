export interface QuizProps {
  question: string;
  answers: { text: string; correct: boolean }[];
}

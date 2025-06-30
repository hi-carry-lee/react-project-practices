import type { RouteLink } from ".";
import QuizHome from "./pages/1-quize/quiz-home";

// Define your practice pages
export const practicePages: RouteLink[] = [
  {
    path: "/1-quize",
    name: "Simple Quiz Game",
    component: QuizHome,
    description: "A simple quiz game to test your knowledge",
  },
];

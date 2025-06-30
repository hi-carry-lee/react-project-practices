import type { RouteLink } from ".";
import QuizePage from "./pages/1-quize/zustand/quize-page";

// Define your practice pages
export const practicePages: RouteLink[] = [
  {
    path: "/1-quize",
    name: "Simple Quiz Game",
    component: QuizePage,
    description: "A simple quiz game to test your knowledge",
  },
];

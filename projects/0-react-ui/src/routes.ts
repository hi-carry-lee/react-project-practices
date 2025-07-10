import type { RouteLink } from ".";
import QuizHome from "./pages/1-quize/quiz-home";
import ColorPalette from "./pages/2-color-pallete/color-pallete";
import DragDropPage from "./pages/3-drag-drop/kanban-home";
import ExpenseTracker from "./pages/4-expense-tracker/expense-tracker";

// Define your practice pages
export const practicePages: RouteLink[] = [
  {
    path: "/1-quize",
    name: "Simple Quiz Game",
    component: QuizHome,
    description: "A simple quiz game to test your knowledge",
  },
  {
    path: "/2-quize",
    name: "Color Pallete",
    component: ColorPalette,
    description: "Generate colors for you life",
  },
  {
    path: "/3-drag-drop",
    name: "Drag Drop",
    component: DragDropPage,
    description: "Simple Kanban board",
  },
  {
    path: "/4-expense-tracker",
    name: "Expense Tracker",
    component: ExpenseTracker,
    description: "Track your every expense",
  },
];

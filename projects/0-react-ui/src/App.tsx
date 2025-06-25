import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your practice page components (you'll create these)
import HomePage from "./components/home.tsx";
import Navbar from "./components/navbar.tsx";
import { practicePages } from "./data.ts";

// Main App component
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {practicePages.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={<page.component />}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

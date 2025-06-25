import { Link } from "react-router-dom";
import { practicePages } from "../data";
import Header from "./header";
import Footer from "./footer";

// Home page component with all links
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-12">
        <Header />
        {/* Practice Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {practicePages.map((page, index) => (
            <Link
              key={page.path}
              to={page.path}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="bg-blue-100 text-blue-600 rounded-lg p-2 group-hover:bg-blue-200 transition-colors">
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {page.name}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {page.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;

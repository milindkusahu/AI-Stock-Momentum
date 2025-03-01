import { useState } from "react";
import StockInput from "./components/StockAnalyzer/StockInput";
import AnalysisResult from "./components/StockAnalyzer/AnalysisResult";
import { analyzeStock } from "./services/api";
import type { AnalysisResult as AnalysisResultType } from "./types";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResultType | null>(null);

  const handleAnalyze = async (symbol: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeStock(symbol);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze stock");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-2 px-4 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-4">
            Professional Stock Analysis Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Stock Momentum Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Harness the power of AI and technical analysis to make informed
            investment decisions
          </p>
        </header>

        <main className="space-y-8">
          <div
            className="card animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <StockInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-fade-in">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12 animate-fade-in">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-6 text-gray-600 text-lg">
                Analyzing market data...
              </p>
            </div>
          )}

          {result && !isLoading && (
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <AnalysisResult result={result} />
            </div>
          )}
        </main>

        <footer className="mt-16 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Stock data and technical analysis are for informational purposes
            only. Please conduct your own research before making investment
            decisions.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Contact
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

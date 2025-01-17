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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Stock Momentum Analyzer
          </h1>
          <p className="text-gray-600">
            Enter a stock symbol to analyze its technical indicators and get AI
            predictions
          </p>
        </header>

        <main>
          <StockInput onAnalyze={handleAnalyze} isLoading={isLoading} />

          {error && (
            <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Analyzing stock data...</p>
            </div>
          )}

          {result && !isLoading && <AnalysisResult result={result} />}
        </main>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Stock data and technical analysis are for informational purposes
            only. Please conduct your own research before making investment
            decisions.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

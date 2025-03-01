import { useState } from "react";

interface StockInputProps {
  onAnalyze: (symbol: string) => void;
  isLoading: boolean;
}

function StockInput({ onAnalyze, isLoading }: StockInputProps) {
  const [symbol, setSymbol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onAnalyze(symbol.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label
            htmlFor="stock-symbol"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Stock Symbol
          </label>
          <input
            id="stock-symbol"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g., AAPL, GOOGL, MSFT"
            className="input-field"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !symbol.trim()}
          className={`button-primary w-full ${
            isLoading || !symbol.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:transform hover:scale-105"
          }`}
        >
          {isLoading ? "Analyzing..." : "Analyze Stock"}
        </button>
      </form>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {["RELIANCE", "ASIANPAINT", "TCS", "HDFCBANK"].map((stock) => (
          <button
            key={stock}
            onClick={() => setSymbol(stock)}
            className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {stock}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StockInput;

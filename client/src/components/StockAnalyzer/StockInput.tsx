import { useState } from "react";

interface StockInputProps {
  onAnalyze: (symbol: string) => void;
  isLoading: boolean;
}

const StockInput: React.FC<StockInputProps> = ({ onAnalyze, isLoading }) => {
  const [symbol, setSymbol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onAnalyze(symbol.trim().toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter stock symbol (e.g., RELIANCE)"
        className="flex-1 p-2 border rounded"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!symbol.trim() || isLoading}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? "Analyzing..." : "Analyze"}
      </button>
    </form>
  );
};

export default StockInput;

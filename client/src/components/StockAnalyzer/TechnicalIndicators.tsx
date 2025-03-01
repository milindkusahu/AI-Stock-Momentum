import { StockData, Analysis } from "../../types";

interface TechnicalIndicatorsProps {
  stockData: StockData;
  analysis: Analysis;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({
  stockData,
  analysis,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* RSI */}
      <div
        className="p-4 bg-background-primary rounded-lg shadow dark:shadow-gray-800 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-700/50 animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <h3 className="font-bold mb-2 text-accent-primary">RSI</h3>
        <div className="text-lg mb-1 font-medium">
          {stockData.rsi.toFixed(2)}
        </div>
        <p className="text-text-secondary">{analysis.rsiAnalysis}</p>
      </div>

      {/* MACD */}
      <div
        className="p-4 bg-background-primary rounded-lg shadow dark:shadow-gray-800 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-700/50 animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <h3 className="font-bold mb-2 text-accent-primary">MACD</h3>
        <div className="text-lg mb-1">
          <span className="font-medium">MACD:</span> {stockData.macd.toFixed(2)}{" "}
          | <span className="font-medium">Signal:</span>{" "}
          {stockData.signalLine.toFixed(2)}
        </div>
        <p className="text-text-secondary">{analysis.macdAnalysis}</p>
      </div>

      {/* Moving Average */}
      <div
        className="p-4 bg-background-primary rounded-lg shadow dark:shadow-gray-800 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-700/50 animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <h3 className="font-bold mb-2 text-accent-primary">
          Moving Average (50-day)
        </h3>
        <div className="text-lg mb-1 font-medium">
          ₹{stockData.movingAverage50.toFixed(2)}
        </div>
        <p className="text-text-secondary">{analysis.maAnalysis}</p>
      </div>

      {/* Volume */}
      <div
        className="p-4 bg-background-primary rounded-lg shadow dark:shadow-gray-800 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-700/50 animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <h3 className="font-bold mb-2 text-accent-primary">Volume Analysis</h3>
        <div className="text-lg mb-1">
          <span className="font-medium">
            {stockData.volume.toLocaleString()}
          </span>{" "}
          (
          <span
            className={`${
              stockData.volume > stockData.averageVolume
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {(stockData.volume / stockData.averageVolume).toFixed(2)}x
          </span>{" "}
          avg)
        </div>
        <p className="text-text-secondary">{analysis.volumeAnalysis}</p>
      </div>

      {/* Bollinger Bands */}
      <div
        className="p-4 bg-background-primary rounded-lg shadow dark:shadow-gray-800 md:col-span-2 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-700/50 animate-fade-in"
        style={{ animationDelay: "0.5s" }}
      >
        <h3 className="font-bold mb-2 text-accent-primary">Bollinger Bands</h3>
        <div className="text-lg mb-1">
          <span className="font-medium">Upper:</span>{" "}
          <span className="text-green-600 dark:text-green-400">
            ₹{stockData.bollingerBands.upper.toFixed(2)}
          </span>{" "}
          |<span className="font-medium"> Middle:</span>{" "}
          <span>₹{stockData.bollingerBands.middle.toFixed(2)}</span> |
          <span className="font-medium"> Lower:</span>{" "}
          <span className="text-red-600 dark:text-red-400">
            ₹{stockData.bollingerBands.lower.toFixed(2)}
          </span>
        </div>
        <p className="text-text-secondary">{analysis.bollingerAnalysis}</p>
      </div>
    </div>
  );
};

export default TechnicalIndicators;

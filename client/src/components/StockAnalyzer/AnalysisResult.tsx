import { AnalysisResult as AnalysisResultType } from "../../types";
import { generatePDF } from "../../services/pdfGenerator";
import AIPrediction from "./AIPrediction";

interface AnalysisResultProps {
  result: AnalysisResultType;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const { recommendation, stockData, analysis } = result;

  // Calculate derived values safely
  const volumeRatio = stockData.volume / stockData.averageVolume;

  const getRecommendationColor = () => {
    switch (recommendation) {
      case "Buy":
        return "text-green-600 dark:text-green-500";
      case "Sell":
        return "text-red-600 dark:text-red-500";
      default:
        return "text-yellow-600 dark:text-yellow-500";
    }
  };

  const handleDownload = () => {
    generatePDF(result);
  };

  const MetricCard = ({
    title,
    value,
    description,
  }: {
    title: string;
    value: string;
    description: string;
  }) => (
    <div className="bg-background-secondary rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300 shadow dark:shadow-gray-800">
      <h3 className="text-text-secondary text-sm font-medium mb-2">{title}</h3>
      <p className="text-text-primary text-2xl font-bold mb-2">{value}</p>
      <p className="text-text-secondary text-sm">{description}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="card bg-background-secondary border border-accent-secondary/20 animate-slide-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-text-primary">
            <span className="text-accent-primary">{stockData.symbol}</span> -
            Analysis
          </h2>
          <button
            onClick={handleDownload}
            className="button-primary flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download Report</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-text-secondary">
            Recommendation:
          </span>
          <span
            className={`text-2xl font-bold ${getRecommendationColor()} border-b-2 border-current pb-1 animate-fade-in`}
          >
            {recommendation}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="RSI Analysis"
          value={stockData.rsi.toFixed(2)}
          description={analysis.rsiAnalysis}
        />

        <MetricCard
          title="MACD Analysis"
          value={stockData.macd.toFixed(2)}
          description={analysis.macdAnalysis}
        />

        <MetricCard
          title="Price Analysis"
          value={`₹${stockData.currentPrice.toFixed(2)}`}
          description={analysis.maAnalysis}
        />

        <MetricCard
          title="Volume Analysis"
          value={`${volumeRatio.toFixed(2)}x`}
          description={analysis.volumeAnalysis}
        />
      </div>

      {/* Bollinger Bands Analysis */}
      <div
        className="card bg-background-secondary border border-accent-secondary/20 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-700/50 animate-fade-in"
        style={{ animationDelay: "0.5s" }}
      >
        <h3 className="text-lg font-semibold text-accent-primary mb-4">
          Bollinger Bands Analysis
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Upper Band</span>
            <span className="text-text-primary font-medium text-green-600 dark:text-green-400">
              ₹{stockData.bollingerBands.upper.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Current Price</span>
            <span className="text-text-primary font-medium">
              ₹{stockData.currentPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Lower Band</span>
            <span className="text-text-primary font-medium text-red-600 dark:text-red-400">
              ₹{stockData.bollingerBands.lower.toFixed(2)}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-text-secondary">{analysis.bollingerAnalysis}</p>
          </div>
        </div>
      </div>

      {/* AI Prediction */}
      {analysis.aiPrediction && (
        <AIPrediction
          prediction={analysis.aiPrediction}
          currentPrice={stockData.currentPrice}
        />
      )}
    </div>
  );
};

export default AnalysisResult;

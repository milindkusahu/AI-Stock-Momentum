import { AnalysisResult as AnalysisResultType } from "../../types";
import { generatePDF } from "../../services/pdfGenerator";
import TechnicalIndicators from "./TechnicalIndicators";
import AIPrediction from "./AIPrediction";

interface AnalysisResultProps {
  result: AnalysisResultType;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const { recommendation, stockData, analysis } = result;

  const getRecommendationColor = () => {
    switch (recommendation) {
      case "Buy":
        return "text-green-600";
      case "Sell":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const handleDownload = () => {
    generatePDF(result);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">
            {stockData.symbol} - ₹{stockData.currentPrice.toFixed(2)}
          </h2>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Download Report
          </button>
        </div>
        <div className={`text-xl font-semibold ${getRecommendationColor()}`}>
          Recommendation: {recommendation}
        </div>
      </div>

      <TechnicalIndicators stockData={stockData} analysis={analysis} />

      {analysis.aiPrediction && (
        <AIPrediction prediction={analysis.aiPrediction} />
      )}
    </div>
  );
};

export default AnalysisResult;

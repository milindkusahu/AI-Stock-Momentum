import { AIPrediction as AIPredictionType } from "../../types";

interface AIPredictionProps {
  prediction: AIPredictionType;
  currentPrice?: number;
}

const AIPrediction: React.FC<AIPredictionProps> = ({
  prediction,
  currentPrice,
}) => {
  const getRecommendationColor = (recommendation: string) => {
    const colors = {
      Buy: "text-green-600 dark:text-green-500",
      Sell: "text-red-600 dark:text-red-500",
      Hold: "text-yellow-600 dark:text-yellow-500",
    };
    return (
      colors[recommendation as keyof typeof colors] ||
      "text-yellow-600 dark:text-yellow-500"
    );
  };

  const getPriceChangeColor = () => {
    if (!currentPrice || !prediction.shortTermTarget) return "";
    return prediction.shortTermTarget > currentPrice
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  const calculatePriceChange = () => {
    if (!currentPrice || !prediction.shortTermTarget) return null;
    const change =
      ((prediction.shortTermTarget - currentPrice) / currentPrice) * 100;
    return change.toFixed(2);
  };

  const priceChange = calculatePriceChange();
  const priceChangeNum = priceChange ? parseFloat(priceChange) : 0;

  return (
    <div
      className="card bg-background-secondary border border-accent-secondary/20 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-700/50 animate-fade-in"
      style={{ animationDelay: "0.6s" }}
    >
      <h3 className="text-lg font-semibold text-accent-primary mb-4 border-b border-accent-secondary pb-2">
        AI Prediction
      </h3>

      <div className="space-y-4">
        <div
          className="flex items-center justify-between animate-fade-in"
          style={{ animationDelay: "0.7s" }}
        >
          <span className="text-text-secondary">Prediction</span>
          <span
            className={`font-bold ${getRecommendationColor(
              prediction.prediction
            )}`}
          >
            {prediction.prediction}
          </span>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary">Confidence</span>
            <span
              className={`font-medium ${
                prediction.confidence > 70
                  ? "text-green-600 dark:text-green-400"
                  : prediction.confidence > 40
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {prediction.confidence}%
            </span>
          </div>
          <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
            <div
              className="absolute h-full bg-accent-primary transition-all duration-1000 ease-out rounded"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
        </div>

        {prediction.shortTermTarget && (
          <div
            className="flex items-center justify-between animate-fade-in"
            style={{ animationDelay: "0.9s" }}
          >
            <span className="text-text-secondary">Price Target</span>
            <div className="flex items-center">
              <span className="font-medium text-text-primary">
                ₹{prediction.shortTermTarget.toFixed(2)}
              </span>
              {priceChange && (
                <span className={`ml-2 text-sm ${getPriceChangeColor()}`}>
                  ({priceChangeNum > 0 ? "+" : ""}
                  {priceChange}%)
                </span>
              )}
            </div>
          </div>
        )}

        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          <h4 className="text-sm font-medium text-text-secondary">
            Supporting Factors
          </h4>
          <ul className="space-y-2">
            {prediction.supportingFactors.map((factor, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-text-primary">{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "1.1s" }}
        >
          <h4 className="text-sm font-medium text-text-secondary">
            Risk Factors
          </h4>
          <ul className="space-y-2">
            {prediction.risks.map((risk, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </span>
                <span className="text-text-primary">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIPrediction;

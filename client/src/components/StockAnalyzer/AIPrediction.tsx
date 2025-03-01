import { AIPrediction as AIPredictionType } from "../../types";

interface AIPredictionProps {
  prediction: AIPredictionType;
}

const AIPrediction: React.FC<AIPredictionProps> = ({ prediction }) => {
  return (
    <div
      className="p-4 bg-background-primary rounded-lg shadow dark:shadow-gray-800 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-700/50 animate-fade-in"
      style={{ animationDelay: "0.6s" }}
    >
      <h2 className="text-xl font-bold mb-4 text-accent-primary border-b border-accent-secondary pb-2">
        AI Analysis
      </h2>

      <div className="space-y-4">
        <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <h3 className="font-semibold mb-2 text-accent-primary">Prediction</h3>
          <p className="text-lg bg-accent-secondary/10 p-3 rounded-lg border-l-4 border-accent-primary">
            {prediction.prediction}
          </p>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <h3 className="font-semibold mb-2 text-accent-primary">Confidence</h3>
          <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
            <div
              className="absolute h-full bg-accent-primary transition-all duration-1000 ease-out rounded"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-text-secondary">
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
            </span>{" "}
            confidence
          </p>
        </div>

        {prediction.shortTermTarget && (
          <div className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <h3 className="font-semibold mb-2 text-accent-primary">
              Target Price
            </h3>
            <p className="text-lg">
              <span className="font-medium text-accent-primary">
                ₹{prediction.shortTermTarget.toFixed(2)}
              </span>
              {prediction.priceChange && (
                <span
                  className={`text-sm ml-2 ${
                    prediction.priceChange > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  ({prediction.priceChange > 0 ? "+" : ""}
                  {prediction.priceChange}%)
                </span>
              )}
            </p>
          </div>
        )}

        <div className="animate-fade-in" style={{ animationDelay: "1s" }}>
          <h3 className="font-semibold mb-2 text-accent-primary">
            Supporting Factors
          </h3>
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
                <span className="text-text-secondary">{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "1.1s" }}>
          <h3 className="font-semibold mb-2 text-accent-primary">Risks</h3>
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
                <span className="text-text-secondary">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIPrediction;

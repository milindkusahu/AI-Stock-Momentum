import { AIPrediction as AIPredictionType } from "../../types";

interface AIPredictionProps {
  prediction: AIPredictionType;
}

const AIPrediction: React.FC<AIPredictionProps> = ({ prediction }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">AI Analysis</h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Prediction</h3>
          <p className="text-lg">{prediction.prediction}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Confidence</h3>
          <div className="relative w-full h-4 bg-gray-200 rounded">
            <div
              className="absolute h-full bg-blue-500 rounded"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {prediction.confidence}% confidence
          </p>
        </div>

        {prediction.shortTermTarget && (
          <div>
            <h3 className="font-semibold mb-2">Target Price</h3>
            <p className="text-lg">₹{prediction.shortTermTarget.toFixed(2)}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Supporting Factors</h3>
          <ul className="list-disc list-inside space-y-1">
            {prediction.supportingFactors.map((factor, index) => (
              <li key={index} className="text-gray-600">
                {factor}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Risks</h3>
          <ul className="list-disc list-inside space-y-1">
            {prediction.risks.map((risk, index) => (
              <li key={index} className="text-gray-600">
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIPrediction;

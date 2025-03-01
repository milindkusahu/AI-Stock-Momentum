import { StockData, Analysis } from "../../types";

interface TechnicalIndicatorsProps {
  stockData: StockData;
  analysis: Analysis;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({
  stockData,
  analysis,
}) => {
  // This component is now deprecated as the functionality has been incorporated
  // into the updated AnalysisResult component using the MetricCard pattern.
  // Keeping this component for backward compatibility, but it will render nothing.
  return null;
};

export default TechnicalIndicators;

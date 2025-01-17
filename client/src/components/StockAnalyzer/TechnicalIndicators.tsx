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
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold mb-2">RSI</h3>
        <div className="text-lg mb-1">{stockData.rsi.toFixed(2)}</div>
        <p className="text-gray-600">{analysis.rsiAnalysis}</p>
      </div>

      {/* MACD */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold mb-2">MACD</h3>
        <div className="text-lg mb-1">
          MACD: {stockData.macd.toFixed(2)} | Signal:{" "}
          {stockData.signalLine.toFixed(2)}
        </div>
        <p className="text-gray-600">{analysis.macdAnalysis}</p>
      </div>

      {/* Moving Average */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold mb-2">Moving Average (50-day)</h3>
        <div className="text-lg mb-1">
          ₹{stockData.movingAverage50.toFixed(2)}
        </div>
        <p className="text-gray-600">{analysis.maAnalysis}</p>
      </div>

      {/* Volume */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold mb-2">Volume Analysis</h3>
        <div className="text-lg mb-1">
          {stockData.volume.toLocaleString()} (
          {(stockData.volume / stockData.averageVolume).toFixed(2)}x avg)
        </div>
        <p className="text-gray-600">{analysis.volumeAnalysis}</p>
      </div>

      {/* Bollinger Bands */}
      <div className="p-4 bg-white rounded-lg shadow md:col-span-2">
        <h3 className="font-bold mb-2">Bollinger Bands</h3>
        <div className="text-lg mb-1">
          Upper: ₹{stockData.bollingerBands.upper.toFixed(2)} | Middle: ₹
          {stockData.bollingerBands.middle.toFixed(2)} | Lower: ₹
          {stockData.bollingerBands.lower.toFixed(2)}
        </div>
        <p className="text-gray-600">{analysis.bollingerAnalysis}</p>
      </div>
    </div>
  );
};

export default TechnicalIndicators;

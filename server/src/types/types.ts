export interface StockData {
  symbol: string;
  currentPrice: number;
  rsi: number;
  movingAverage50: number;
  volume: number;
  averageVolume: number;
  macd: number;
  signalLine: number;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export interface AIPrediction {
  prediction: string;
  confidence: number;
  supportingFactors: string[];
  risks: string[];
  shortTermTarget: number | null;
}

export interface AnalysisResult {
  recommendation: "Buy" | "Sell" | "Hold";
  stockData: StockData;
  analysis: {
    rsiAnalysis: string;
    maAnalysis: string;
    volumeAnalysis: string;
    macdAnalysis: string;
    bollingerAnalysis: string;
    aiPrediction?: AIPrediction; // Optional AI prediction
  };
}

export class MovingAverageService {
  calculateMA(prices: number[], periods: number): number {
    if (prices.length < periods) {
      throw new Error("Not enough data to calculate MA");
    }
    const sum = prices.slice(-periods).reduce((a, b) => a + b, 0);
    return sum / periods;
  }

  getMAAnalysis(currentPrice: number, ma50: number): string {
    const percentDiff = ((currentPrice - ma50) / ma50) * 100;
    if (percentDiff > 3) {
      return `Price is ${percentDiff.toFixed(
        2
      )}% above the 50-day MA, showing upward trend.`;
    } else if (percentDiff < -3) {
      return `Price is ${Math.abs(percentDiff).toFixed(
        2
      )}% below the 50-day MA, showing downward trend.`;
    }
    return `Price is near the 50-day MA (${percentDiff.toFixed(
      2
    )}% difference), indicating sideways movement.`;
  }

  getMASignal(currentPrice: number, ma50: number): "Buy" | "Sell" | "Neutral" {
    const percentDiff = ((currentPrice - ma50) / ma50) * 100;
    if (percentDiff > 3) return "Buy"; // More sensitive threshold
    if (percentDiff < -3) return "Sell"; // More sensitive threshold
    if (percentDiff > 1) return "Buy"; // Slight upward trend
    if (percentDiff < -1) return "Sell"; // Slight downward trend
    return "Neutral";
  }
}

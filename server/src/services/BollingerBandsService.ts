export class BollingerBandsService {
  calculateBollingerBands(
    prices: number[],
    period: number = 20,
    standardDeviations: number = 2
  ) {
    if (prices.length < period) {
      throw new Error("Not enough data to calculate Bollinger Bands");
    }

    // Calculate middle band (SMA)
    const middleBand = this.calculateSMA(prices, period);

    // Calculate standard deviation
    const priceWindow = prices.slice(-period);
    const sum = priceWindow.reduce((a, b) => a + b, 0);
    const mean = sum / period;
    const squaredDiffs = priceWindow.map((price) => Math.pow(price - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    const standardDeviation = Math.sqrt(variance);

    // Calculate upper and lower bands
    const upperBand = middleBand + standardDeviation * standardDeviations;
    const lowerBand = middleBand - standardDeviation * standardDeviations;

    return {
      upper: upperBand,
      middle: middleBand,
      lower: lowerBand,
    };
  }

  private calculateSMA(prices: number[], period: number): number {
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  getBollingerAnalysis(
    currentPrice: number,
    bands: { upper: number; middle: number; lower: number }
  ): string {
    const { upper, middle, lower } = bands;
    const bandwidth = ((upper - lower) / middle) * 100;

    if (currentPrice > upper) {
      return `Price (${currentPrice.toFixed(
        2
      )}) is above upper band (${upper.toFixed(
        2
      )}), indicating overbought conditions. Bandwidth: ${bandwidth.toFixed(
        2
      )}%`;
    } else if (currentPrice < lower) {
      return `Price (${currentPrice.toFixed(
        2
      )}) is below lower band (${lower.toFixed(
        2
      )}), indicating oversold conditions. Bandwidth: ${bandwidth.toFixed(2)}%`;
    }
    return `Price (${currentPrice.toFixed(2)}) is within bands (${lower.toFixed(
      2
    )} - ${upper.toFixed(2)}). Bandwidth: ${bandwidth.toFixed(2)}%`;
  }

  getBollingerSignal(
    currentPrice: number,
    bands: { upper: number; middle: number; lower: number }
  ): "Buy" | "Sell" | "Neutral" {
    const { upper, lower } = bands;
    if (currentPrice < lower) return "Buy";
    if (currentPrice > upper) return "Sell";
    return "Neutral";
  }
}

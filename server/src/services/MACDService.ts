export class MACDService {
  calculateMACD(prices: number[]): {
    macd: number;
    signal: number;
    histogram: number;
  } {
    const fastEMA = this.calculateEMA(prices, 12);
    const slowEMA = this.calculateEMA(prices, 26);
    const macdLine = fastEMA - slowEMA;
    const signalLine = this.calculateEMA(
      [...Array(prices.length - 26).fill(0), macdLine],
      9
    );
    const histogram = macdLine - signalLine;

    return {
      macd: macdLine,
      signal: signalLine,
      histogram: histogram,
    };
  }

  private calculateEMA(prices: number[], period: number): number {
    const k = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = prices[i] * k + ema * (1 - k);
    }

    return ema;
  }

  getMACDAnalysis(macd: number, signal: number, histogram: number): string {
    if (macd > signal && histogram > 0) {
      return `MACD (${macd.toFixed(2)}) is above Signal (${signal.toFixed(
        2
      )}) with positive histogram, indicating bullish momentum.`;
    } else if (macd < signal && histogram < 0) {
      return `MACD (${macd.toFixed(2)}) is below Signal (${signal.toFixed(
        2
      )}) with negative histogram, indicating bearish momentum.`;
    }
    return `MACD (${macd.toFixed(2)}) and Signal (${signal.toFixed(
      2
    )}) showing neutral momentum.`;
  }

  getMACDSignal(
    macd: number,
    signal: number,
    histogram: number
  ): "Buy" | "Sell" | "Neutral" {
    if (macd > signal && histogram > 0) return "Buy";
    if (macd < signal && histogram < 0) return "Sell";
    return "Neutral";
  }
}

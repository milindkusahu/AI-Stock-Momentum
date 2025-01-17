export class RSIService {
  calculateRSI(prices: number[], periods: number = 14): number {
    if (prices.length < periods + 1) {
      throw new Error("Not enough data to calculate RSI");
    }

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain and loss
    for (let i = 1; i <= periods; i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }

    let avgGain = gains / periods;
    let avgLoss = losses / periods;

    // Calculate RSI using most recent periods
    for (let i = periods + 1; i < prices.length; i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference >= 0) {
        avgGain = (avgGain * (periods - 1) + difference) / periods;
        avgLoss = (avgLoss * (periods - 1)) / periods;
      } else {
        avgGain = (avgGain * (periods - 1)) / periods;
        avgLoss = (avgLoss * (periods - 1) - difference) / periods;
      }
    }

    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  }

  getRSIAnalysis(rsi: number): string {
    if (rsi > 65) {
      return `RSI is ${rsi.toFixed(
        2
      )}, indicating strongly overbought conditions. Consider selling.`;
    } else if (rsi < 35) {
      return `RSI is ${rsi.toFixed(
        2
      )}, indicating strongly oversold conditions. Consider buying.`;
    } else if (rsi > 60) {
      return `RSI is ${rsi.toFixed(2)}, showing overbought tendency.`;
    } else if (rsi < 40) {
      return `RSI is ${rsi.toFixed(2)}, showing oversold tendency.`;
    }
    return `RSI is ${rsi.toFixed(2)}, indicating neutral momentum.`;
  }

  getRSISignal(rsi: number): "Buy" | "Sell" | "Neutral" {
    if (rsi > 65) return "Sell"; // More aggressive overbought
    if (rsi < 35) return "Buy"; // More aggressive oversold
    if (rsi > 60) return "Sell"; // Early overbought warning
    if (rsi < 40) return "Buy"; // Early oversold warning
    return "Neutral";
  }
}

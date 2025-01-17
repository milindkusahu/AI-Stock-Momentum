export class VolumeService {
  calculateAverageVolume(volumes: number[], periods: number = 30): number {
    if (volumes.length < periods) {
      throw new Error("Not enough data to calculate average volume");
    }
    const sum = volumes.slice(-periods).reduce((a, b) => a + b, 0);
    return sum / periods;
  }

  getVolumeAnalysis(volume: number, averageVolume: number): string {
    const volumeRatio = volume / averageVolume;
    if (volumeRatio > 1.2) {
      return `Volume is ${volumeRatio.toFixed(
        2
      )}x the average, indicating strong market interest.`;
    } else if (volumeRatio < 0.8) {
      return `Volume is ${volumeRatio.toFixed(
        2
      )}x the average, indicating weak market interest.`;
    }
    return `Volume is normal at ${volumeRatio.toFixed(2)}x the average.`;
  }

  getVolumeSignal(
    volume: number,
    averageVolume: number,
    isUptrend: boolean
  ): "Buy" | "Sell" | "Neutral" {
    const volumeRatio = volume / averageVolume;
    if (volumeRatio > 1.2) {
      return isUptrend ? "Buy" : "Sell"; // Strong volume confirms trend
    }
    if (volumeRatio < 0.8) {
      return isUptrend ? "Sell" : "Buy"; // Low volume might indicate trend reversal
    }
    if (volumeRatio > 1.1 && isUptrend) {
      return "Buy"; // Slight volume increase in uptrend
    }
    if (volumeRatio < 0.9 && !isUptrend) {
      return "Buy"; // Volume declining in downtrend might indicate reversal
    }
    return "Neutral";
  }
}

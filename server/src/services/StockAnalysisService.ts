import axios from "axios";
import { config } from "../config/config";
import { StockData, AnalysisResult } from "../types/types";
import { RSIService } from "./RSIService";
import { MovingAverageService } from "./MovingAverageService";
import { VolumeService } from "./VolumeService";
import { MACDService } from "./MACDService";
import { BollingerBandsService } from "./BollingerBandsService";
import { AIPredictionService } from "./AIPredictionService";

interface DailyData {
  close: number;
  volume: number;
}

interface SignalStrength {
  signal: "Buy" | "Sell" | "Neutral";
  weight: number;
}

export class StockAnalysisService {
  private aiPredictionService: AIPredictionService;
  private rsiService: RSIService;
  private maService: MovingAverageService;
  private volumeService: VolumeService;
  private macdService: MACDService;
  private bollingerService: BollingerBandsService;

  constructor() {
    this.rsiService = new RSIService();
    this.maService = new MovingAverageService();
    this.volumeService = new VolumeService();
    this.macdService = new MACDService();
    this.bollingerService = new BollingerBandsService();
    this.aiPredictionService = new AIPredictionService();
  }

  private async fetchStockData(symbol: string): Promise<any> {
    try {
      // Define possible symbol formats for Indian stocks
      const formats = [
        symbol, // Try original
        symbol.toUpperCase(), // Try uppercase
        `${symbol}.NS`, // Try NSE
        `${symbol}.BSE`, // Try BSE
        symbol.replace(/[.].*$/, ""), // Try without any suffix
      ];

      let lastError: Error | null = null;

      for (const format of formats) {
        try {
          console.log(`Attempting to fetch data for symbol: ${format}`);

          const params = {
            function: "TIME_SERIES_DAILY",
            symbol: format,
            apikey: config.alphaVantageApiKey,
            outputsize: "compact",
          };

          console.log("Request params:", JSON.stringify(params));

          const response = await axios.get(config.apiBaseUrl, { params });

          // Log the actual response for debugging
          console.log("Response headers:", response.headers);
          console.log("Response status:", response.status);
          console.log("Response data keys:", Object.keys(response.data));

          // Check for actual time series data
          if (response.data["Time Series (Daily)"]) {
            console.log(`Successfully fetched data for ${format}`);
            return response.data;
          }

          // If we get error message from Alpha Vantage
          if (response.data["Error Message"]) {
            console.log(
              `Alpha Vantage Error for ${format}:`,
              response.data["Error Message"]
            );
            throw new Error(response.data["Error Message"]);
          }

          // If we get Information message (usually rate limit)
          if (response.data["Information"]) {
            console.log(
              `Alpha Vantage Information for ${format}:`,
              response.data["Information"]
            );
            throw new Error(`API Note: ${response.data["Information"]}`);
          }

          // If we get a Note (usually approaching rate limit)
          if (response.data["Note"]) {
            console.log(
              `Alpha Vantage Note for ${format}:`,
              response.data["Note"]
            );
          }
        } catch (err) {
          const error = err as Error;
          lastError = error;
          console.error(`Failed attempt with symbol ${format}:`, error.message);
          // Continue to try next format unless it's a rate limit error
          if (error.message.includes("API Note: Please consider upgrading")) {
            throw error;
          }
          continue;
        }
      }

      // If we get here, none of the formats worked
      throw new Error(
        `Could not fetch data for symbol ${symbol}. Last error: ${lastError?.message}`
      );
    } catch (error) {
      console.error("Final fetch error:", error);
      throw error;
    }
  }

  private processRawData(data: any): DailyData[] {
    const timeSeriesData = data["Time Series (Daily)"];
    if (!timeSeriesData) {
      throw new Error("Invalid data format received from API");
    }

    // Get dates sorted in descending order (most recent first)
    const dates = Object.keys(timeSeriesData).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    // Map the data with dates included
    const processedData = dates.map((date) => ({
      date: new Date(date),
      close: parseFloat(timeSeriesData[date]["4. close"]),
      volume: parseFloat(timeSeriesData[date]["5. volume"]),
    }));

    // Return in chronological order (oldest to newest)
    return processedData.reverse();
  }

  private getLastClosingPrice(data: any): number {
    const timeSeriesData = data["Time Series (Daily)"];
    if (!timeSeriesData) {
      throw new Error("Invalid data format received from API");
    }

    // Get dates sorted in descending order
    const dates = Object.keys(timeSeriesData).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    // Get the most recent closing price
    return parseFloat(timeSeriesData[dates[0]]["4. close"]);
  }

  private getWeightedRecommendation(
    signals: SignalStrength[]
  ): "Buy" | "Sell" | "Hold" {
    let buyScore = 0;
    let sellScore = 0;
    const totalWeight = signals.reduce((sum, signal) => sum + signal.weight, 0);

    signals.forEach(({ signal, weight }) => {
      if (signal === "Buy") buyScore += weight;
      else if (signal === "Sell") sellScore += weight;
    });

    // Convert to percentages
    buyScore = (buyScore / totalWeight) * 100;
    sellScore = (sellScore / totalWeight) * 100;

    // Lower thresholds for more active signals
    if (buyScore > 45) return "Buy"; // Changed from 60
    if (sellScore > 45) return "Sell"; // Changed from 60

    // Additional check for strong individual signals
    if (buyScore > 35 && sellScore < 20) return "Buy"; // Strong buy with little sell pressure
    if (sellScore > 35 && buyScore < 20) return "Sell"; // Strong sell with little buy pressure

    return "Hold";
  }

  public async analyzeStock(symbol: string): Promise<AnalysisResult> {
    try {
      const rawData = await this.fetchStockData(symbol);
      const dailyData = this.processRawData(rawData);
      const lastClosingPrice = this.getLastClosingPrice(rawData);
      const prices = dailyData.map((d) => d.close);
      const volumes = dailyData.map((d) => d.volume);

      // Calculate all indicators using last closing price
      const rsi = this.rsiService.calculateRSI(prices);
      const movingAverage50 = this.maService.calculateMA(prices, 50);
      const currentVolume = volumes[volumes.length - 1];
      const averageVolume = this.volumeService.calculateAverageVolume(volumes);
      const macd = this.macdService.calculateMACD(prices);
      const bollingerBands =
        this.bollingerService.calculateBollingerBands(prices);

      // Get signals with weights
      const signals: SignalStrength[] = [
        {
          signal: this.rsiService.getRSISignal(rsi),
          weight: rsi > 60 || rsi < 40 ? 2.5 : 2.0, // Increased weight for stronger signals
        },
        {
          signal: this.maService.getMASignal(lastClosingPrice, movingAverage50),
          weight:
            Math.abs(
              ((lastClosingPrice - movingAverage50) / movingAverage50) * 100
            ) > 3
              ? 2.0
              : 1.5,
        },
        {
          signal: this.volumeService.getVolumeSignal(
            currentVolume,
            averageVolume,
            lastClosingPrice > movingAverage50
          ),
          weight: currentVolume / averageVolume > 1.2 ? 1.5 : 1.0, // Increased weight for high volume
        },
        {
          signal: this.macdService.getMACDSignal(
            macd.macd,
            macd.signal,
            macd.histogram
          ),
          weight: Math.abs(macd.histogram) > 1 ? 2.5 : 2.0, // Increased weight for strong MACD signals
        },
        {
          signal: this.bollingerService.getBollingerSignal(
            lastClosingPrice,
            bollingerBands
          ),
          weight: 1.5,
        },
      ];

      const stockData: StockData = {
        symbol,
        currentPrice: lastClosingPrice, // Using last closing price
        rsi,
        movingAverage50,
        volume: currentVolume,
        averageVolume,
        macd: macd.macd,
        signalLine: macd.signal,
        bollingerBands,
      };

      const recommendation = this.getWeightedRecommendation(signals);
      const aiPrediction = await this.aiPredictionService.getPrediction(
        symbol,
        stockData
      );

      return {
        recommendation,
        stockData,
        analysis: {
          rsiAnalysis: this.rsiService.getRSIAnalysis(rsi),
          maAnalysis: this.maService.getMAAnalysis(
            lastClosingPrice,
            movingAverage50
          ),
          volumeAnalysis: this.volumeService.getVolumeAnalysis(
            currentVolume,
            averageVolume
          ),
          macdAnalysis: this.macdService.getMACDAnalysis(
            macd.macd,
            macd.signal,
            macd.histogram
          ),
          bollingerAnalysis: this.bollingerService.getBollingerAnalysis(
            lastClosingPrice,
            bollingerBands
          ),
          aiPrediction,
        },
      };
    } catch (error) {
      throw new Error(`Failed to analyze stock: ${error}`);
    }
  }
}

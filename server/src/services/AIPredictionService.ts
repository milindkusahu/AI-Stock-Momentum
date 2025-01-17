import axios from "axios";
import { config } from "../config/config";
import { AIPrediction, StockData } from "../types/types";

export class AIPredictionService {
  private readonly OPENAI_API_URL =
    "https://api.openai.com/v1/chat/completions";
  private readonly MODEL = "gpt-3.5-turbo";

  constructor() {
    if (!config.openAiApiKey) {
      throw new Error("OpenAI API key is not configured");
    }
  }

  private getBollingerPosition(technicalData: StockData): string {
    const { currentPrice, bollingerBands } = technicalData;
    const { upper, middle, lower } = bollingerBands;

    if (currentPrice > upper)
      return "Above upper band - potentially overbought";
    if (currentPrice < lower) return "Below lower band - potentially oversold";
    if (Math.abs(currentPrice - middle) / middle < 0.01)
      return "At middle band - neutral";
    if (currentPrice > middle) return "Between middle and upper band - bullish";
    return "Between middle and lower band - bearish";
  }

  private calculateTrendStrength(technicalData: StockData): number {
    let strength = 50; // Base score

    // RSI contribution (0-20 points)
    if (technicalData.rsi > 70 || technicalData.rsi < 30) {
      strength += 20;
    } else if (technicalData.rsi > 60 || technicalData.rsi < 40) {
      strength += 10;
    }

    // MACD contribution (0-15 points)
    const macdDiff = Math.abs(technicalData.macd - technicalData.signalLine);
    if (macdDiff > 2) strength += 15;
    else if (macdDiff > 1) strength += 10;
    else strength += 5;

    // Volume contribution (0-15 points)
    const volumeRatio = technicalData.volume / technicalData.averageVolume;
    if (volumeRatio > 1.5) strength += 15;
    else if (volumeRatio > 1.2) strength += 10;
    else if (volumeRatio > 1) strength += 5;

    return Math.min(strength, 100);
  }

  private async generatePrompt(
    symbol: string,
    technicalData: StockData
  ): Promise<string> {
    const priceChangePercent =
      ((technicalData.currentPrice - technicalData.movingAverage50) /
        technicalData.movingAverage50) *
      100;
    const volumeRatio = technicalData.volume / technicalData.averageVolume;
    const trendStrength = this.calculateTrendStrength(technicalData);

    return `Analyze ${symbol} stock technical indicators:

PRICE & TRENDS:
- Current: ₹${technicalData.currentPrice.toFixed(2)}
- 50MA: ₹${technicalData.movingAverage50.toFixed(
      2
    )} (${priceChangePercent.toFixed(2)}% difference)
- RSI: ${technicalData.rsi.toFixed(2)}
- MACD Line: ${technicalData.macd.toFixed(2)}
- MACD Signal: ${technicalData.signalLine.toFixed(2)}
- Volume: ${volumeRatio.toFixed(2)}x average
- Bollinger Position: ${this.getBollingerPosition(technicalData)}
- Technical Strength: ${trendStrength}%

Provide brief analysis in this exact format:

PREDICTION: Start with "Price likely to..." and include specific range
CONFIDENCE: [0-100]
FACTORS:
- [Factor 1]
- [Factor 2]
- [Factor 3]
RISKS:
- [Risk 1]
- [Risk 2]`;
  }

  public async getPrediction(
    symbol: string,
    technicalData: StockData
  ): Promise<AIPrediction> {
    try {
      const prompt = await this.generatePrompt(symbol, technicalData);

      const response = await axios.post(
        this.OPENAI_API_URL,
        {
          model: this.MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a technical analyst focusing on short-term price movements based on technical indicators. Provide clear, concise predictions with specific price targets.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${config.openAiApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      return this.parseResponse(aiResponse, technicalData);
    } catch (error) {
      console.error("Failed to get AI prediction:", error);
      return this.getDefaultPrediction(technicalData);
    }
  }

  private parseResponse(
    response: string,
    technicalData: StockData
  ): AIPrediction {
    try {
      const result: AIPrediction = {
        prediction: "",
        confidence: 0,
        supportingFactors: [],
        risks: [],
        shortTermTarget: null,
      };

      const lines = response.split("\n");
      let currentSection = "";

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith("PREDICTION:")) {
          result.prediction = trimmedLine.substring(11).trim();
          // Try to extract target price
          const priceMatch = trimmedLine.match(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/);
          if (priceMatch) {
            result.shortTermTarget = parseFloat(
              priceMatch[1].replace(/,/g, "")
            );
          }
        } else if (trimmedLine.startsWith("CONFIDENCE:")) {
          const match = trimmedLine.match(/\d+/);
          result.confidence = match
            ? Math.min(parseInt(match[0]), 100)
            : this.calculateTrendStrength(technicalData);
        } else if (trimmedLine === "FACTORS:") {
          currentSection = "factors";
        } else if (trimmedLine === "RISKS:") {
          currentSection = "risks";
        } else if (trimmedLine.startsWith("-")) {
          const point = trimmedLine.substring(1).trim();
          if (currentSection === "factors") {
            result.supportingFactors.push(point);
          } else if (currentSection === "risks") {
            result.risks.push(point);
          }
        }
      }

      // If prediction is empty, use default
      if (!result.prediction) {
        const defaultPrediction = this.getDefaultPrediction(technicalData);
        result.prediction = defaultPrediction.prediction;
      }

      // Ensure we have some factors and risks
      if (result.supportingFactors.length === 0) {
        result.supportingFactors = [
          `RSI at ${technicalData.rsi.toFixed(2)} indicates ${this.getRSITrend(
            technicalData.rsi
          )}`,
          `MACD ${
            technicalData.macd > technicalData.signalLine ? "above" : "below"
          } signal line`,
          `Volume ${
            technicalData.volume > technicalData.averageVolume
              ? "above"
              : "below"
          } average`,
        ];
      }

      if (result.risks.length === 0) {
        result.risks = [
          "Technical signals may change rapidly",
          "Market conditions could affect predictions",
        ];
      }

      return result;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return this.getDefaultPrediction(technicalData);
    }
  }

  private getRSITrend(rsi: number): string {
    if (rsi > 70) return "overbought conditions";
    if (rsi < 30) return "oversold conditions";
    if (rsi > 60) return "bullish momentum";
    if (rsi < 40) return "bearish momentum";
    return "neutral momentum";
  }

  private getDefaultPrediction(technicalData: StockData): AIPrediction {
    const trend =
      technicalData.currentPrice > technicalData.movingAverage50
        ? "bullish"
        : "bearish";
    const strength = this.calculateTrendStrength(technicalData);

    return {
      prediction: `Price likely to show ${trend} trend near ₹${technicalData.currentPrice.toFixed(
        2
      )}`,
      confidence: strength,
      supportingFactors: [
        `RSI at ${technicalData.rsi.toFixed(2)} indicates ${this.getRSITrend(
          technicalData.rsi
        )}`,
        `MACD ${
          technicalData.macd > technicalData.signalLine ? "above" : "below"
        } signal line`,
        `Price ${
          trend === "bullish" ? "above" : "below"
        } 50-day moving average`,
      ],
      risks: [
        "Technical signals may change rapidly",
        "Market conditions could shift unexpectedly",
      ],
      shortTermTarget: null,
    };
  }
}

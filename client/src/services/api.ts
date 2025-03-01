import { AnalysisResult } from "../types";

const API_URL = "https://ai-stock-momentum.vercel.app/api";

export const analyzeStock = async (symbol: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(`${API_URL}/stock/${symbol}`);

    if (!response.ok) {
      const errorData = await response.json();

      // Check if it's an Alpha Vantage API rate limit error
      if (
        errorData.message &&
        errorData.message.includes("Alpha Vantage") &&
        errorData.message.includes("rate limit")
      ) {
        throw new Error(
          "Alpha Vantage API rate limit reached. The free plan allows only 25 requests per day. Please try again tomorrow or consider upgrading to a premium plan."
        );
      }

      // For 429 rate limit errors from our own API
      if (response.status === 429) {
        throw new Error(
          errorData.message || "Rate limit exceeded. Please try again later."
        );
      }

      // For other errors
      throw new Error(errorData.message || "Failed to analyze stock");
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
